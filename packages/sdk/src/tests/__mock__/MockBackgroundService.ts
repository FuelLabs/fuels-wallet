import type { AbiMap, CommunicationMessage } from '@fuel-wallet/types';
import {
  FuelWalletEvents,
  BACKGROUND_SCRIPT_NAME,
  CONTENT_SCRIPT_NAME,
  MessageTypes,
} from '@fuel-wallet/types';
import type { WalletUnlocked } from 'fuels';
import { transactionRequestify, Wallet } from 'fuels';
import type { JSONRPCResponse } from 'json-rpc-2.0';

import { BaseConnection } from '../../connections/BaseConnection';

import { AbiContractId, FlatAbi } from './abi';

const generateOptions = {
  provider: process.env.PUBLIC_PROVIDER_URL!,
};
export const toWallet = Wallet.generate(generateOptions);

export class MockBackgroundService extends BaseConnection {
  connection: chrome.runtime.Port;

  state: {
    wallet: WalletUnlocked;
    isConnected: boolean;
    accounts: Array<string>;
    network: { url: string };
    abiMap: AbiMap;
  };

  constructor(extensionId: string) {
    super();
    // Mock commnucation protocol isolated by extension id
    this.connection = chrome.runtime.connect(extensionId);
    this.connection.onMessage.addListener(this.onMessage.bind(this));
    this.externalMethods([
      this.ping,
      this.connect,
      this.disconnect,
      this.isConnected,
      this.accounts,
      this.network,
      this.signMessage,
      this.sendTransaction,
      this.currentAccount,
      this.addAssets,
      this.assets,
      this.addAbi,
      this.getAbi,
      this.hasAbi,
    ]);
    // Mock state of the background service
    // declared in this way to enable replacement
    // of the state object for testing purposes
    const wallet = Wallet.generate(generateOptions);
    this.state = {
      wallet,
      isConnected: true,
      accounts: [wallet.address.toAddress()],
      network: {
        url: process.env.PUBLIC_PROVIDER_URL!,
      },
      abiMap: {
        [AbiContractId]: FlatAbi,
      },
    };
  }

  onMessage(message: CommunicationMessage) {
    if (message.target === BACKGROUND_SCRIPT_NAME) {
      this.onCommunicationMessage(message);
    }
  }

  sendResponse(response: JSONRPCResponse | null): void {
    this.connection.postMessage({
      type: MessageTypes.response,
      response,
      target: CONTENT_SCRIPT_NAME,
    } as CommunicationMessage);
  }

  sendEvent(event: string, params: Array<unknown>): void {
    const data: CommunicationMessage = {
      type: MessageTypes.event,
      events: [
        {
          event,
          params,
        },
      ],
      target: CONTENT_SCRIPT_NAME,
    };
    this.connection.postMessage(data);
  }

  static start(extensionId: string) {
    return new MockBackgroundService(extensionId);
  }

  /**
   * JSON RPC Methods
   */
  async ping() {
    return true;
  }

  async isConnected() {
    return this.state.isConnected;
  }

  async connect() {
    this.sendEvent(FuelWalletEvents.connection, [true]);
    return true;
  }

  async network() {
    const network = this.state.network;
    this.sendEvent(FuelWalletEvents.network, [network]);
    return network;
  }

  async disconnect() {
    this.sendEvent(FuelWalletEvents.connection, [false]);
    return true;
  }

  async accounts() {
    const accounts = this.state.accounts;
    this.sendEvent(FuelWalletEvents.accounts, [accounts]);
    return accounts;
  }

  async signMessage(params: {
    account: string;
    message: string;
    address: string;
  }) {
    return this.state.wallet.signMessage(params.message);
  }

  async sendTransaction(params: {
    address: string;
    transaction: string;
    message: string;
  }) {
    const transaction = transactionRequestify(JSON.parse(params.transaction));
    const response = await this.state.wallet.sendTransaction(transaction);
    return response.id;
  }

  async currentAccount() {
    const account = this.state.wallet.address.toAddress();
    this.sendEvent(FuelWalletEvents.currentAccount, [account]);
    return account;
  }

  async assets() {
    const assets = await this.state.wallet.getBalances();
    return assets;
  }

  async addAsset(): Promise<boolean> {
    return true;
  }

  async addAssets(): Promise<boolean> {
    return true;
  }

  async addAbi(): Promise<boolean> {
    return true;
  }

  async getAbi() {
    return this.state.abiMap[AbiContractId];
  }

  async hasAbi(): Promise<boolean> {
    return true;
  }
}
