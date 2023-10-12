import {
  CONTENT_SCRIPT_NAME,
  EVENT_MESSAGE,
  FuelWalletEvents,
  MessageTypes,
} from '@fuel-wallet/types';
import type {
  CommunicationMessage,
  FuelWalletConnector,
} from '@fuel-wallet/types';
import type { JSONRPCRequest } from 'json-rpc-2.0';

import { hasWindow } from '../utils/hasWindow';
import { deferPromise } from '../utils/promise';

import { BaseConnection } from './BaseConnection';

export class WindowConnection extends BaseConnection {
  isListenerAdded = false;
  queue: JSONRPCRequest[] = [];
  _retry = 0;
  _injectionTimeout: NodeJS.Timeout;
  _hasWallet = deferPromise<boolean>();
  connectorName: string;
  private connectors: Array<FuelWalletConnector>;

  constructor(connector?: FuelWalletConnector) {
    super();
    this.connectorName = connector ? connector.name : '';
    this.connectors = connector ? [connector] : [];
    this.handleFuelInjected();
    this._injectionTimeout = setInterval(
      this.handleFuelInjected.bind(this),
      100,
    );
    this.handleIsReady();
  }

  executeQueuedRequests() {
    // Execute pending requests in the queue
    let request = this.queue.shift();
    while (request) {
      this.sendRequest(request);
      request = this.queue.shift();
    }
  }

  handleIsReady() {
    if (typeof document === 'undefined') return;
    document.addEventListener('FuelLoaded', () => {
      this._retry = 0;
      this._hasWallet.resolve(true);
      this._hasWallet = deferPromise<boolean>();
      this.handleFuelInjected();
      this.emit(FuelWalletEvents.load, true);
    });
  }

  hasConnector(connectorName: string): boolean {
    return !!this.connectors.find((c) => c.name === connectorName);
  }

  addConnector(connector: FuelWalletConnector): void {
    // Ensure Fuel Wallet is the default connector
    if (connector.name === 'Fuel Wallet') {
      this.connectorName = connector.name;
    }
    if (this.hasConnector(connector.name)) {
      throw new Error(`"${connector.name}" connector already exists!`);
    }
    this.connectors.push(connector);
    this.emit(FuelWalletEvents.connectors, this.listConnectors());
  }

  removeConnector(connectorName: string): void {
    const connectorIndex = this.connectors.findIndex(
      (c) => c.name === connectorName,
    );
    if (connectorIndex > -1) {
      this.connectors.splice(connectorIndex, 1);
    }
  }

  listConnectors(): Array<FuelWalletConnector> {
    return this.connectors;
  }

  async selectConnector(connectorName: string): Promise<boolean> {
    const previousConnector = this.connectorName;
    this.connectorName = connectorName;
    try {
      const connectorName = await this.client
        .timeout(1000)
        .request('connectorName', {});
      // Check if the current connector is in the list of connectors
      let connector = this.connectors.find((c) => c.name === connectorName);
      // If not, add it to the list of connectors
      if (!connector) {
        connector = { name: connectorName };
        this.addConnector({ name: connectorName });
      }
      // Emit the current connector
      this.emit(FuelWalletEvents.currentConnector, connector);
    } catch {
      // If the connector is not found, revert the change and throw an error
      this.connectorName = previousConnector;
      throw new Error(`"${connectorName}" connector not found!`);
    }
    return true;
  }

  acceptMessage(message: MessageEvent<CommunicationMessage>): boolean {
    const { data: event } = message;
    return (
      message.origin === window.origin &&
      event.target === this.connectorName &&
      event.type !== MessageTypes.request
    );
  }

  async hasWallet(): Promise<boolean> {
    return this._hasWallet.promise;
  }

  async sendRequest(request: JSONRPCRequest | null) {
    if (!request) return;

    if (!window.fuel) {
      this.queue.push(request);
    } else {
      this.postMessage({
        type: MessageTypes.request,
        target: CONTENT_SCRIPT_NAME,
        connectorName: this.connectorName,
        request,
      });
    }
  }

  onMessage = (message: MessageEvent<CommunicationMessage>) => {
    const messageFroze = Object.freeze(message);
    if (!this.acceptMessage(messageFroze)) return;
    const { data: event } = messageFroze;
    this.onCommunicationMessage(event);
  };

  postMessage(message: CommunicationMessage, origin?: string) {
    if (!this.hasConnector(this.connectorName)) {
      throw new Error(`Wallet Connector ${this.connectorName} not found!`);
    }
    window.postMessage(message, origin || window.origin);
  }

  bindFuelConnectors(fuel: Window['fuel']) {
    // Prevent binding to self if this happen the
    // object would enter on a infinite loop
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isSelf = (fuel as any) === this;
    if (!fuel || isSelf) return;
    // Bind to fuel events to
    // sync with current instace
    fuel.on(FuelWalletEvents.connectors, (connectors) => {
      this.connectors = connectors;
      this.emit(FuelWalletEvents.connectors, connectors);
    });
    fuel.on(FuelWalletEvents.currentConnector, (connector) => {
      this.selectConnector(connector.name);
    });
    // Update the current connectors list
    this.connectors = fuel.listConnectors();
    // Trigger connectros list changed event
    this.emit(FuelWalletEvents.connectors, this.listConnectors());
    // Sync the current connector
    this.selectConnector(fuel.connectorName);
  }

  handleFuelInjected() {
    // Timeout after 10 retries i.e., 1 second
    if (this._retry === 9) {
      clearInterval(this._injectionTimeout);
      this._hasWallet.resolve(false);
      this.client.rejectAllPendingRequests(
        'Timeout fuel not detected on the window!',
      );
      return;
    }

    this._retry++;

    if (hasWindow) {
      if (!this.isListenerAdded) {
        window.addEventListener(EVENT_MESSAGE, this.onMessage.bind(this));
        this.isListenerAdded = true;
      }
      if (window.fuel) {
        clearInterval(this._injectionTimeout);
        this._hasWallet.resolve(true);
        this.bindFuelConnectors(window.fuel);
        this.executeQueuedRequests();
      }
    }
  }
}
