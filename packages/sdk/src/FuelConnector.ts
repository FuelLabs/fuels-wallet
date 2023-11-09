/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Asset } from '@fuel-wallet/types';
import EventEmitter from 'events';
import type { TransactionRequestLike } from 'fuels';

import { FuelConnectorEventTypes } from './api';
import type {
  FuelABI,
  FuelConnectorEvents,
  FuelEventArg,
  Network,
  Version,
  ConnectorMetadata,
} from './types';

/**
 * @name FuelConnector
 *
 * Wallet Connector is a interface that represents a Wallet Connector and all the methods
 * that should be implemented to be compatible with the Fuel SDK.
 */
export abstract class FuelConnector extends EventEmitter {
  name: string = '';
  metadata: ConnectorMetadata = {} as ConnectorMetadata;
  connected: boolean = false;
  installed: boolean = false;
  events = FuelConnectorEventTypes;

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
   *
   * @returns {string} - The transaction id
   */
  async sendTransaction(
    address: string,
    transaction: TransactionRequestLike
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
   * @returns {Asset} assets - The assets metadata from the connector vinculated to the all accounts from a specific Wallet.
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
  async addNetwork(networkUrl: string): Promise<boolean> {
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
   * Should return the ABI from the connector vinculated to the all accounts from a specific Wallet.
   *
   * @param {string} contractId - The contract id to get the abi
   * @returns {FuelABI | null} abi - The fuel abi that represents a contract or script.
   */
  async getABI(id: string): Promise<FuelABI | null> {
    throw new Error('Method not implemented.');
  }

  /**
   * Should return true if the abi exists in the connector vinculated to the all accounts from a specific Wallet.
   *
   * @param {string} contractId - The contract id to get the abi
   * @return {boolean} - Return true if the abi exists or false if not.
   */
  async hasABI(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  /**
   * Event listener for the connector.
   *
   * @param {string} eventName - The event name to listen
   * @param {function} listener - The listener function
   */
  on<E extends FuelConnectorEvents['type'], D extends FuelEventArg<E>>(
    eventName: E,
    listener: (data: D) => void
  ): this {
    super.on(eventName, listener);
    return this;
  }
}
