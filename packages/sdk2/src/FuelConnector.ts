/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Asset } from '@fuels/assets';
import EventEmitter from 'events';
import type {
  WalletLocked,
  Provider,
  JsonAbi,
  TransactionRequestLike,
} from 'fuels';

import { FuelEvents } from './FuelConnectorAPI';

/****
 * ========================================================================================
 * Helpers
 * ========================================================================================
 */

/**
 * Extract the event argument type from the event type.
 */
export type FuelEventArg<T extends FuelConnectorEvents['type']> = Extract<
  FuelEvents,
  { type: T }
>['data'];

/****
 * ========================================================================================
 * Events
 * ========================================================================================
 */

/**
 * Event trigger when the accounts available to the
 * connection changes.
 *
 * @property {string} type - The event type.
 * @property {string[]} accounts - The accounts addresses
 */
export type AccountsEvent = {
  type: FuelEvents.accounts;
  data: Array<string>;
};

/**
 * Event trigger when the current account on the connector is changed
 * if the account is not authorized for the connection it should trigger with value null.
 *
 * @property {string} type - The event type.
 * @property {string | null} data - The current account selected or null.
 */
export type AccountEvent = {
  type: FuelEvents.currentAccount;
  data: string | null;
};

/**
 * Event trigger when connection status changes. With the new connection status.
 *
 * @event ConnectionEvent
 * @type {object}
 * @property {string} type - The event type.
 * @property {boolean} data - The new connection status.
 */
export type ConnectionEvent = {
  type: FuelEvents.connection;
  data: boolean;
};

/**
 * Event trigger when the network seleted on the connector is changed.
 * It should trigger even if the network is not available for the connection.
 *
 * @event NetworkEvent
 * @type {object}
 * @property {string} type - The event type.
 * @property {Network} data - The network information
 */
export type NetworkEvent = {
  type: FuelEvents.currentNetwork;
  data: Network;
};

/**
 * Event trigger when the network seleted on the connector is changed.
 * It should trigger even if the network is not available for the connection.
 *
 * @event NetworksEvent
 * @type {object}
 * @property {string} type - The event type.
 * @property {Network[]} data - The network information
 */
export type NetworksEvent = {
  type: FuelEvents.networks;
  data: Network;
};

/**
 * Event trigger when the list of connectors has changed.
 *
 * @event ConnectorsEvent
 * @type {object}
 * @property {string} type - The event type.
 * @property {FuelConnector[]} data - The list of connectors
 */
export type ConnectorsEvent = {
  type: FuelEvents.connectors;
  data: Array<FuelConnector>;
};

/**
 * Event trigger when the current connector has changed.
 *
 * @event ConnectorEvent
 * @type {object}
 * @property {string} type - The event type.
 * @property {FuelConnector} data - The list of connectors
 */
export type ConnectorEvent = {
  type: FuelEvents.currentConnector;
  data: FuelConnector;
};

/**
 * All the events available to the connector.
 */
export type FuelConnectorEvents =
  | ConnectionEvent
  | NetworkEvent
  | NetworksEvent
  | AccountEvent
  | AccountsEvent
  | ConnectorsEvent
  | ConnectorEvent;

export type FuelConnectorEventsType = FuelConnectorEvents['type'];

/****
 * ========================================================================================
 * Data Types
 * ========================================================================================
 */

/**
 * @name Version
 */
export type Version = {
  app: string;
  /**
   * Version selection this allow
   * Caret Ranges ^1.2.3 ^0.2.5 ^0.0.4
   * Tilde Ranges ~1.2.3 ~1.2 ~1
   * And Exact Versions 1.0.0
   */
  network: string;
};

/**
 * @name Network
 */
export type Network = {
  /**
   * The name of the network.
   */
  url: string;
  /**
   * The chain id of the network.
   */
  chainId: number;
};

/**
 * Asset metadata that represents a asset_id from Fuel Network.
 *
 * Read more at: https://github.com/FuelLabs/fuels-npm-packs/tree/main/packages/assets
 */
export type FuelAsset = Asset;

/**
 * ABI that represents a binary code interface from Sway.
 *
 * Read more at: https://docs.fuel.network/docs/specs/abi/json-abi-format/
 */
export type FuelABI = JsonAbi;

/****
 * ========================================================================================
 * Wallet Connector Metadata
 * ========================================================================================
 */

export type WalletConnectorMetadata = {
  image:
    | string
    | {
        light: string;
        dark: string;
      };
  connector: string;
  install: {
    action: string;
    link: string;
    description: string;
  };
};

/****
 * ========================================================================================
 * Wallet Connector Interface
 * ========================================================================================
 */

/**
 * @name FuelConnector
 *
 * Wallet Connector is a interface that represents a Wallet Connector and all the methods
 * that should be implemented to be compatible with the Fuel SDK.
 */
export abstract class FuelConnector extends EventEmitter {
  name: string = '';
  metadata: WalletConnectorMetadata = {} as WalletConnectorMetadata;
  connected: boolean = false;
  installed: boolean = false;
  events = FuelEvents;

  /**
   * Should return true if the connector is loaded
   * in less then one second.
   *
   * @returns {true} - always true.
   */
  async ping(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  /**
   * Should return the current version of the connector
   * and the network version that is compatible.
   *
   * @returns {boolean} - connection status.
   */
  async version(): Promise<Version> {
    throw new Error('Method not implemented.');
  }

  /**
   * Should return true if the connector is connected
   * to any of the accounts available.
   *
   * @returns {boolean} - connection status.
   */
  async isConnected(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  /**
   * Should return all the accounts authorized for the
   * current connection.
   *
   * @returns {string[]} - Accounts addresses
   */
  async accounts(): Promise<Array<string>> {
    throw new Error('Method not implemented.');
  }

  /**
   * Should start the connection process and return
   * true if the account authorize the connection.
   *
   * and return false if the user reject the connection.
   *
   * @emits accounts
   * @returns {boolean} - connection status.
   */
  async connect(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  /**
   * Should disconnect the current connection and
   * return false if the disconnection was successful.
   *
   * @emits assets connection
   * @returns {boolean} - connection status.
   */
  async disconnect(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  /**
   * Should start the sign message process and return
   * the signed message.
   *
   * @param {string} address - The address to sign the message
   * @param {string} message - The message to sign all text will be treated as text utf-8
   *
   * @returns {string} - Message signature
   */
  async signMessage(address: string, message: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

  /**
   * Should start the send transaction process and return
   * the transaction id submitted to the network.
   *
   * If the network is not available for the connection
   * it should throw an error to avoid the transaction
   * to be sent to the wrong network and lost.
   *
   * @param {string} address - The address to sign the transaction
   * @param {Transaction} transaction - The transaction to send
   * @param {Network} network - The network that the transaction will be sent to
   *
   * @returns {string} - The transaction id
   */
  async sendTransaction(
    address: string,
    transaction: TransactionRequestLike,
    network: Network
  ): Promise<string> {
    throw new Error('Method not implemented.');
  }

  /**
   * Should return the current account selected inside the connector, if the account
   * is authorized for the connection.
   *
   * If the account is not authorized it should return null.
   *
   * @returns {string | null} - The current account selected or null.
   */
  async currentAccount(): Promise<string | null> {
    throw new Error('Method not implemented.');
  }

  /**
   * Should add the the assets metadata to the connector and return true if the asset
   * was added successfully.
   *
   * If the asset already exists it should throw an error.
   *
   * @emits assets
   * @param {Asset[]} assets - The assets to add the metadata to the connection.
   * @returns True if the asset was added successfully
   * @throws Error if the asset already exists
   */
  async addAssets(assets: Array<Asset>): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  /**
   * Should return all the assets added to the connector. If a connection is already established.
   *
   * @returns {Asset} assets - The assets metadata from the connector vinculated to the all accounts from a specifc Wallet.
   */
  async assets(): Promise<Array<Asset>> {
    throw new Error('Method not implemented.');
  }

  /**
   * Should start the add network process and return true if the network was added successfully.
   *
   * @emits networks
   * @throws {Error} if the network already exists
   * @returns {boolean} boolean - Return true if the network was added successfully
   */
  async addNetwork(network: Network): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  /**
   * Should start the select network process and return true if the network has change successfully.
   *
   * @emits networks
   * @throws {Error} if the network already exists
   * @returns {boolean} boolean - Return true if the network was added successfully
   */
  async selectNetwork(network: Network): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  /**
   * Should return all the networks available from the connector. If the connection is already established.
   *
   * @returns {Network[]} networks - Return all the networks added to the connector.
   */
  async networks(): Promise<Array<Network>> {
    throw new Error('Method not implemented.');
  }

  /**
   * Should return the current network selected inside the connector. Even if the connection is not established.
   *
   * @returns {Network} network - Return all the networks added to the connector.
   */
  async currentNetwork(): Promise<Network> {
    throw new Error('Method not implemented.');
  }

  /**
   * Should add the abi to the connector and return true if the abi was added successfully.
   *
   * @param {FuelABI} abi - The fuel abi that represents a contract.
   * @throws {Error} if the abi already exists
   * @returns {boolean} - Return true if the abi was added successfully
   */
  async addABI(contractId: string, abi: FuelABI): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  /**
   * Should return the ABI from the connector vinculated to the all accounts from a specifc Wallet.
   *
   * @param {string} contractId - The contract id to get the abi
   * @returns {FuelABI | null} abi - The fuel abi that represents a contract or script.
   */
  async getABI(id: string): Promise<FuelABI | null> {
    throw new Error('Method not implemented.');
  }

  /**
   * Should return true if the abi exists in the connector vinculated to the all accounts from a specifc Wallet.
   *
   * @param {string} contractId - The contract id to get the abi
   * @return {boolean} - Return true if the abi exists or false if not.
   */
  async hasABI(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  /**
   * Should return a instance of WalletLocked that represents the current wallet
   *
   * @param {string} address - The address of the account that should intantied the Wallet.
   * @returns {WalletLocked}
   */
  async getWallet(address: string): Promise<WalletLocked> {
    throw new Error('Method not implemented.');
  }

  /**
   * Should return a instance of the Provider that represents the current network selected
   *
   * @returns {Provider}
   */
  async getProvider(): Promise<Provider> {
    throw new Error('Method not implemented.');
  }

  /**
   * Event listener for the connector.
   *
   * @param {string} eventName - The event name to listen
   * @param {function} listener - The listener function
   */
  on<E extends FuelConnectorEvents['type'], D extends FuelEventArg<E>>(
    eventName: E | '*',
    listener: (data: D) => void
  ): this {
    super.on(eventName, listener);
    return this;
  }
}
