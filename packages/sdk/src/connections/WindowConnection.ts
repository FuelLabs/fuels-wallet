/* eslint-disable @typescript-eslint/no-unused-vars */
import { EVENT_MESSAGE } from '@fuel-wallet/types';
import type {
  CommunicationMessage,
  FuelWalletConnector,
} from '@fuel-wallet/types';

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

  hasConnector(conectorName: string): boolean {
    return !!this.connectors.find((c) => c.name === conectorName);
  }

  addConnector(conector: FuelWalletConnector): void {
    // Ensure Fuel Wallet is the default connector
    if (this.connectorName === 'Fuel Wallet') {
      this.connectorName = conector.name;
    }
    if (this.hasConnector(conector.name)) {
      throw new Error(`"${conector.name}" connector already exists!`);
    }
    this.emit('connector', conector);
    this.connectors.push(conector);
  }

  removeConnector(conectorName: string): void {
    const connectorIndex = this.connectors.findIndex(
      (c) => c.name === conectorName
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
      await this.client.timeout(1000).request('connectorName', {});
    } catch {
      // If the connector is not found, revert the change and throw an error
      this.connectorName = previousConnector;
      throw new Error(`"${connectorName}" connector not found!`);
    }
    return true;
  }

  acceptMessage(message: MessageEvent<CommunicationMessage>) {
    return true;
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
