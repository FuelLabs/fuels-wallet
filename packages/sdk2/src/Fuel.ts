/* eslint-disable @typescript-eslint/no-explicit-any */
import { FuelConnector } from './FuelConnector';
import { FuelWalletConnector } from './connectors/FuelWalletConnector';

interface TargetObject {
  on?: (event: string, callback: (data: any) => void) => void;
  emit?: (event: string, data: any) => void;
  addEventListener?: (event: string, callback: (event: any) => void) => void;
  removeEventListener?: (event: string, callback: (event: any) => void) => void;
  postMessage?: (message: string) => void;
}

interface Storage {
  setItem: (key: string, value: string) => void;
  getItem: (key: string) => string | null;
  removeItem: (key: string) => void;
}

export type FuelConfig = {
  defaultConnectors?: Array<FuelConnector>;
  connectors?: Array<FuelConnector>;
  storeConnector?: boolean;
  targetObject?: TargetObject;
};

const FUEL_CONNECTOR_COMMON_METHODS = [
  'ping',
  'version',
  'isConnected',
  'accounts',
  'connect',
  'disconnect',
  'signMessage',
  'sendTransaction',
  'currentAccount',
  'addAssets',
  'assets',
  'addNetwork',
  'currentNetwork',
  'networks',
  'addABI',
  'getABI',
  'hasABI',
];
const FUEL_CONNECTOR_COMMON_EVENTS = [
  'accounts',
  'currentAccount',
  'connection',
  'network',
  'assets',
];

export class Fuel extends FuelConnector {
  private currentConnector: FuelConnector;

  connectorEventName: string = 'FuelConnector';
  connectors: Array<FuelConnector> = [];
  targetObject: TargetObject;
  storage?: Storage;
  unsubscribes: Array<() => void> = [];

  constructor(config: FuelConfig = {}) {
    super();
    // Increase the limite of listeners
    this.setMaxListeners(1_000);
    // Fuel Wallet Connector default connector
    const fuelWalletConnector = new FuelWalletConnector();
    // Set all connectors
    this.connectors = [
      ...(config.defaultConnectors || [fuelWalletConnector]),
      ...(config.connectors || []),
    ];
    // Set current connector to be the first one from the list
    this.currentConnector = this.connectors[0];
    // Set the target object to listen for global events
    this.targetObject = config.targetObject || window;
    // Setup new connector listener to know if a
    // new connector was added
    this.setupConnectorListener();
    // Fetch all connectors status to know if they are installed
    // and connected
    this.fetchConnectorsStatus();
    // Setup all methods
    this.setupMethods(FUEL_CONNECTOR_COMMON_METHODS);

    // Get the current connector from the storage
    const connectorName =
      this.storage?.getItem('currentConnector') ||
      this.connectors[0]?.metadata?.name;
    if (connectorName) {
      // Setup all events for the current connector
      this.selectConnector(connectorName);
    }
  }

  /**
   * Start listener for all the events of the current
   * connector and emit them to the Fuel instance
   */
  private setupConnectorEvents(events: string[]) {
    this.unsubscribes.map((unsub) => unsub());
    this.unsubscribes = events.map((event) => {
      const handler = (...args: any[]) => {
        this.emit(event, ...args);
      };
      this.currentConnector.on(event as any, handler);
      return () => this.currentConnector.off(event as any, handler);
    });
  }

  /**
   * Call method from the current connector.
   */
  private async callMethod(method: string, ...args: any[]) {
    await this.pingConnector();
    if (typeof this.currentConnector[method] === 'function') {
      return this.currentConnector[method](...args);
    } else {
      new Error(`Method ${method} is not available for the connector!`);
    }
  }

  /**
   * Create a method for each method proxy that is available on the Common interface
   * and call the method from the current connector.
   */
  private setupMethods(methods: string[]) {
    methods.map((method) => {
      this[method] = async (...args: any[]) => this.callMethod(method, ...args);
    });
  }

  /**
   * Fetch the status of a connector and set the installed and connected
   * status.
   */
  private async fetchConnectorStatus(connector: FuelConnector) {
    const [isConnected, ping] = await Promise.allSettled([
      connector.isConnected(),
      connector.ping(),
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
   * Fetch the status of all connectos and set the installed and connected
   * status.
   */
  private async fetchConnectorsStatus() {
    return this.connectors.map(async (connector) => {
      return this.fetchConnectorStatus(connector);
    });
  }

  /**
   * Fetch the status of a connector and set the installed and connected
   * status.
   */
  private async pingConnector() {
    const ping = await this.currentConnector.ping();
    if (!ping) {
      throw new Error('Current connector is not available!');
    }
  }

  /**
   * Setup a listener for the FuelConnector event and add the connector
   * to the list of new connectors.
   */
  private setupConnectorListener = () => {
    const { targetObject } = this;
    if ('on' in targetObject && targetObject.on) {
      targetObject.on('FuelConnector', this.addConnector);
    }
    if ('addEventListener' in targetObject && targetObject.addEventListener) {
      targetObject.addEventListener('FuelConnector', (e) => {
        this.addConnector(e.detail);
      });
    }
  };

  /**
   * Add a new connector to the list of connectors.
   */
  private addConnector = (connector: FuelConnector) => {
    if (!this.getConnector(connector)) {
      this.connectors.push(connector);
      this.fetchConnectorStatus(connector);
    }
  };

  /**
   * Get a connector from the list of connectors.
   */
  getConnector = (connector: FuelConnector | string): FuelConnector | null => {
    return (
      this.connectors.find((c) => {
        const connectorName =
          typeof connector === 'string' ? connector : connector.metadata.name;
        return c.metadata.name === connectorName || c === connector;
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
  async selectConnector(connectorName: string): Promise<boolean> {
    const connector = this.getConnector(connectorName);
    if (!connector) return false;
    const { installed } = await this.fetchConnectorStatus(connector);
    if (installed) {
      this.currentConnector = connector;
      this.setupConnectorEvents(FUEL_CONNECTOR_COMMON_EVENTS);
      this.storage?.setItem('currentConnector', connector.metadata.name);
    }
    return true;
  }
}
