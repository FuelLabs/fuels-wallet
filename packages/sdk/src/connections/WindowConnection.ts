import {
  CONTENT_SCRIPT_NAME,
  EVENT_MESSAGE,
  FuelWalletEvents,
  FuelWindowEvents,
  MessageTypes,
} from '@fuel-wallet/types';
import type {
  CommunicationMessage,
  FuelWalletConnector,
} from '@fuel-wallet/types';
import type { JSONRPCRequest } from 'json-rpc-2.0';

import type { FuelLoadedEvent, DeferPromiseWithTimeout } from '../utils';
import { FuelConnectorEvent, deferPromiseWithTimeout } from '../utils';

import { BaseConnection } from './BaseConnection';

export class WindowConnection extends BaseConnection {
  isListenerAdded = false;
  queue: JSONRPCRequest[] = [];
  _hasWallet: DeferPromiseWithTimeout<boolean>;
  connectorName: string = '';
  private connectors: Array<FuelWalletConnector>;

  constructor(connector?: FuelWalletConnector) {
    super();
    this.connectors = connector ? [connector] : [];
    this._hasWallet = deferPromiseWithTimeout(1000, this.handleWalletTimeout);
    this.setupListenFuelLoaded();
    this.dispatchQueryConnectors();
  }

  // Dispatch a custom event to query available Fuel connectors
  dispatchQueryConnectors() {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new FuelConnectorEvent());
  }

  // Accept messages from the current window
  acceptMessage(message: MessageEvent<CommunicationMessage>): boolean {
    const { data: event } = message;
    return (
      message.origin === window.origin &&
      event.target === this.connectorName &&
      event.type !== MessageTypes.request
    );
  }

  // Queue requests until the wallet is ready
  executeQueuedRequests() {
    // Execute pending requests in the queue
    let request = this.queue.shift();
    while (request) {
      this.sendRequest(request);
      request = this.queue.shift();
    }
  }

  // Add a listener to the window message event
  handleWalletAvailable() {
    if (!this.isListenerAdded) {
      // Avoid listener to be added multiple times
      this.isListenerAdded = true;
      // Add listener to the window message event
      window.addEventListener(EVENT_MESSAGE, this.onMessage.bind(this));
      // Execute pending requests in the queue
      this.executeQueuedRequests();
      // Emit the load event
      this.emit(FuelWalletEvents.load, true);
    }
  }

  handleWalletTimeout = () => {
    this._hasWallet.resolve(false);
    this.client.rejectAllPendingRequests(
      'Timeout fuel not detected on the window!'
    );
  };

  async hasWallet(): Promise<boolean> {
    if (this._hasWallet.isResolved) {
      return true;
    }
    return this._hasWallet.promise;
  }

  handleFuelLoaded = (event: FuelLoadedEvent) => {
    const { connector } = event;
    // If Fuel Wallet is loaded set it
    // as the default connector
    try {
      this.addConnector(connector);
    } catch {
      // If the connector already exists, ignore the error
    }
    this._hasWallet.resolve(true);
    this.handleWalletAvailable();
  };

  setupListenFuelLoaded() {
    if (typeof window === 'undefined') return;
    window.addEventListener(FuelWindowEvents.FuelLoaded, this.handleFuelLoaded);
  }

  // Connectors management methods
  hasConnector(connectorName: string): boolean {
    return !!this.connectors.find((c) => c.name === connectorName);
  }

  addConnector(connector: FuelWalletConnector): void {
    // Ensure Fuel Wallet is the default connector
    if (connector.name === 'Fuel Wallet' || !this.connectorName) {
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
      (c) => c.name === connectorName
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

  // Communication methods
  async sendRequest(request: JSONRPCRequest | null) {
    if (!request) return;

    if (!this._hasWallet.isResolved && this.connectors.length === 0) {
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

  destroy() {
    window.removeEventListener(EVENT_MESSAGE, this.onMessage);
    window.removeEventListener(
      FuelWindowEvents.FuelLoaded,
      this.handleFuelLoaded
    );
  }
}
