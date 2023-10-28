import { FuelConnector } from './FuelConnector';
import { FuelConnectorEventTypes, FuelConnectorMethods } from './api';
import { FuelConnectorEvent } from './types';
import type {
  FuelConnectorEventsType,
  FuelStorage,
  TargetObject,
} from './types';
import type { CacheFor } from './utils';
import { cacheFor, deferPromise, withTimeout } from './utils';

// This is the time to wait for the connector
// to be available before returning false for hasConnector.
const HAS_CONNECTOR_TIMEOUT = 2_000;
// The time to cache the ping result, as is not
// expected to change the availability of the connector to
// change too often we can safely cache the result for 5 seconds
// at minimum.
const PING_CACHE_TIME = 5_000;

export type FuelConfig = {
  connectors?: Array<FuelConnector>;
  storage?: FuelStorage;
  storeConnector?: boolean;
  targetObject?: TargetObject;
};

export type FuelConnectorSelectOptions = {
  emitEvents?: boolean;
};

export class Fuel extends FuelConnector {
  static STORAGE_KEY = 'fuel-current-connector';

  private storage?: FuelStorage;
  private connectors: Array<FuelConnector> = [];
  private targetObject: TargetObject | null = null;
  private unsubscribes: Array<() => void> = [];
  private targetUnsubscribe: () => void;
  private pingCache: CacheFor = {};

  currentConnector?: FuelConnector | null;

  constructor(config: FuelConfig = {}) {
    super();
    // Increase the limit of listeners
    this.setMaxListeners(1_000);
    // Set all connectors
    this.connectors = config.connectors ?? [];
    // Set the target object to listen for global events
    this.targetObject = this.getTargetObject(config.targetObject);
    // Set default storage
    this.storage = config.storage ?? this.getStorage();
    // Setup all methods
    this.setupMethods();
    // Get the current connector from the storage
    this.setDefaultConnector();
    // Setup new connector listener for global events
    this.targetUnsubscribe = this.setupConnectorListener();
  }

  /**
   * Return the target object to listen for global events.
   */
  private getTargetObject(targetObject?: TargetObject) {
    if (targetObject) return targetObject;
    if (typeof window !== 'undefined') return window;
    if (typeof document !== 'undefined') return document;
    return null;
  }

  /**
   * Return the target object to listen for global events.
   */
  private getStorage() {
    if (typeof window !== 'undefined') return window.localStorage;
    return undefined;
  }

  /**
   * Setup the default connector from the storage.
   */
  private setDefaultConnector() {
    const connectorName =
      this.storage?.getItem(Fuel.STORAGE_KEY) || this.connectors[0]?.name;
    if (connectorName) {
      // Setup all events for the current connector
      return this.selectConnector(connectorName, {
        emitEvents: false,
      });
    }
  }

  /**
   * Start listener for all the events of the current
   * connector and emit them to the Fuel instance
   */
  private setupConnectorEvents(events: string[]) {
    if (!this.currentConnector) return;
    const currentConnector = this.currentConnector;
    this.unsubscribes.map((unSub) => unSub());
    this.unsubscribes = events.map((event) => {
      const handler = (...args: unknown[]) => this.emit(event, ...args);
      currentConnector.on(event as FuelConnectorEventsType, handler);
      return () => currentConnector.off(event, handler);
    });
  }

  /**
   * Call method from the current connector.
   */
  private async callMethod(method: string, ...args: unknown[]) {
    const hasConnector = await this.hasConnector();
    await this.pingConnector();
    if (!this.currentConnector || !hasConnector) {
      throw new Error('No current connector.');
    }
    if (typeof this.currentConnector[method] === 'function') {
      return this.currentConnector[method](...args);
    } else {
      new Error(`Method ${method} is not available for the connector.`);
    }
  }

  /**
   * Create a method for each method proxy that is available on the Common interface
   * and call the method from the current connector.
   */
  private setupMethods() {
    Object.values(FuelConnectorMethods).map((method) => {
      this[method] = async (...args: unknown[]) =>
        this.callMethod(method, ...args);
    });
  }

  /**
   * Fetch the status of a connector and set the installed and connected
   * status.
   */
  private async fetchConnectorStatus(connector: FuelConnector) {
    const [isConnected, ping] = await Promise.allSettled([
      connector.isConnected(),
      withTimeout(this.pingConnector(connector)),
    ]);
    connector.installed = ping.status === 'fulfilled';
    connector.connected =
      isConnected.status === 'fulfilled' && isConnected.value;
    return {
      installed: connector.installed,
      connected: connector.connected,
    };
  }

  /**
   * Fetch the status of all connectors and set the installed and connected
   * status.
   */
  private async fetchConnectorsStatus() {
    return Promise.all(
      this.connectors.map(async (connector) => {
        return this.fetchConnectorStatus(connector);
      })
    );
  }

  /**
   * Fetch the status of a connector and set the installed and connected
   * status. If no connector is provided it will ping the current connector.
   */
  private async pingConnector(connector?: FuelConnector) {
    const { currentConnector } = this;
    if (!currentConnector) return false;
    // If finds a ping in the cache and the value is true
    // return from cache
    try {
      const _connector = connector ?? currentConnector;
      return await cacheFor(
        async () => {
          return withTimeout(_connector.ping());
        },
        {
          key: _connector.name,
          cache: this.pingCache,
          cacheTime: PING_CACHE_TIME,
        }
      )();
    } catch {
      throw new Error('Current connector is not available.');
    }
  }

  /**
   * Setup a listener for the FuelConnector event and add the connector
   * to the list of new connectors.
   */
  private setupConnectorListener = () => {
    const { targetObject } = this;
    const eventName = FuelConnectorEvent.type;
    if (targetObject?.on) {
      targetObject.on(eventName, this.addConnector);
      return () => {
        targetObject.off?.(eventName, this.addConnector);
      };
    }
    if (targetObject?.addEventListener) {
      const handler = (e: FuelConnectorEvent) => {
        this.addConnector(e.detail);
      };
      targetObject.addEventListener(eventName, handler);
      return () => {
        targetObject.removeEventListener?.(eventName, handler);
      };
    }
    return () => {};
  };

  /**
   * Add a new connector to the list of connectors.
   */
  private addConnector = async (connector: FuelConnector) => {
    if (!this.getConnector(connector)) {
      this.connectors.push(connector);
      await this.fetchConnectorStatus(connector);
      // Emit connectors events once the connector list changes
      this.emit(this.events.connectors, this.connectors);
      // If the current connector is not set
      if (!this.currentConnector) {
        // set the new connector as currentConnector
        await this.selectConnector(connector.name, {
          emitEvents: false,
        });
      }
    }
  };

  private triggerConnectorEvents = async () => {
    const [isConnected, networks, currentNetwork] = await Promise.all([
      this.isConnected(),
      this.networks(),
      this.currentNetwork(),
    ]);
    this.emit(this.events.connection, isConnected);
    this.emit(this.events.networks, networks);
    this.emit(this.events.currentNetwork, currentNetwork);
    if (isConnected) {
      const [accounts, currentAccount] = await Promise.all([
        this.accounts(),
        this.currentAccount(),
      ]);
      this.emit(this.events.accounts, accounts);
      this.emit(this.events.currentAccount, currentAccount);
    }
  };

  /**
   * Get a connector from the list of connectors.
   */
  getConnector = (connector: FuelConnector | string): FuelConnector | null => {
    return (
      this.connectors.find((c) => {
        const connectorName =
          typeof connector === 'string' ? connector : connector.name;
        return c.name === connectorName || c === connector;
      }) || null
    );
  };

  /**
   * Return the list of connectors with the status of installed and connected.
   */
  async getConnectors(): Promise<Array<FuelConnector>> {
    await this.fetchConnectorsStatus();
    return this.connectors;
  }

  /**
   * Set the current connector to be used.
   */
  async selectConnector(
    connectorName: string,
    options: FuelConnectorSelectOptions = {
      emitEvents: true,
    }
  ): Promise<boolean> {
    const connector = this.getConnector(connectorName);
    if (!connector) return false;
    if (this.currentConnector?.name === connectorName) return true;
    const { installed } = await this.fetchConnectorStatus(connector);
    if (installed) {
      this.currentConnector = connector;
      this.emit(this.events.currentConnector, connector);
      this.setupConnectorEvents(Object.values(FuelConnectorEventTypes));
      this.storage?.setItem(Fuel.STORAGE_KEY, connector.name);
      // If emitEvents is true we query all the data from the connector
      // and emit the events to the Fuel instance allowing the application to
      // react to changes in the connector state.
      if (options.emitEvents) {
        this.triggerConnectorEvents();
      }
    }
    return true;
  }

  /**
   * Return true if any connector is available.
   */
  async hasConnector(): Promise<boolean> {
    // If there is a current connector return true
    // as the connector is ready
    if (this.currentConnector) return true;
    // If there is no current connector
    // wait for the current connector to be set
    // for 1 second and return false if is not set
    const defer = deferPromise<boolean>();
    this.once(this.events.currentConnector, () => {
      defer.resolve(true);
    });
    // As the max ping time is 1 second we wait for 2 seconds
    // to allow applications to react to the current connector
    return withTimeout(defer.promise, HAS_CONNECTOR_TIMEOUT)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Remove all open listeners this is useful when you want to
   * destroy the Fuel instance and avoid memory leaks.
   */
  destroy() {
    this.unsubscribes.map((unSub) => unSub());
    this.targetUnsubscribe();
  }
}
