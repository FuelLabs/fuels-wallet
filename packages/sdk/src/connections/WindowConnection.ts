import {
  CONTENT_SCRIPT_NAME,
  EVENT_MESSAGE,
  MessageTypes,
} from '@fuel-wallet/types';
import type {
  CommunicationMessage,
  FuelWalletConnector,
} from '@fuel-wallet/types';
import type { JSONRPCRequest } from 'json-rpc-2.0';

import { BaseConnection } from './BaseConnection';

export class WindowConnection extends BaseConnection {
  connectorName: string;
  private connectors: Array<FuelWalletConnector>;

  constructor(connector: FuelWalletConnector) {
    super();
    this.connectorName = connector.name;
    this.connectors = [connector];
    window.addEventListener(EVENT_MESSAGE, this.onMessage.bind(this));
  }

  hasConnector(connectorName: string): boolean {
    return !!this.connectors.find((c) => c.name === connectorName);
  }

  addConnector(connector: FuelWalletConnector): void {
    // Ensure Fuel Wallet is the default connector
    if (this.connectorName === 'Fuel Wallet') {
      this.connectorName = connector.name;
    }
    if (this.hasConnector(connector.name)) {
      throw new Error(`"${connector.name}" connector already exists!`);
    }
    this.emit('connectors', this.listConnectors());
    this.connectors.push(connector);
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
      this.emit('currentConnector', connector);
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

  async sendRequest(request: JSONRPCRequest | null) {
    if (request) {
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
}
