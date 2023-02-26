/* eslint-disable @typescript-eslint/no-explicit-any */

import { FuelWalletEvents, PAGE_SCRIPT_NAME } from '@fuel-wallet/types';
import EventEmitter from 'events';
import { transactionRequestify, Wallet } from 'fuels';
import type { JSONRPCResponse } from 'json-rpc-2.0';

import { Fuel } from '../Fuel';
import { BaseConnection } from '../connections/BaseConnection';

const generateOptions = {
  provider: process.env.PUBLIC_PROVIDER_URL!,
};
export const userWallet = Wallet.generate(generateOptions);
export const toWallet = Wallet.generate(generateOptions);
const events = new EventEmitter();

export class MockConnection extends BaseConnection {
  constructor() {
    super();
    events.addListener('request', this.onCommunicationMessage.bind(this));
    this.externalMethods([
      this.connect,
      this.disconnect,
      this.isConnected,
      this.accounts,
      this.network,
      this.signMessage,
      this.sendTransaction,
      this.currentAccount,
      this.assets,
      this.addAsset,
    ]);
  }

  static start() {
    return new MockConnection();
  }

  sendResponse(response: JSONRPCResponse | null): void {
    events.emit('message', {
      data: {
        type: 'response',
        target: PAGE_SCRIPT_NAME,
        response,
      },
    });
  }

  async network() {
    const network = {
      url: process.env.PUBLIC_PROVIDER_URL!,
    };
    fuel.emit(FuelWalletEvents.network, network);
    return network;
  }

  async isConnected() {
    return true;
  }

  async connect() {
    fuel.emit(FuelWalletEvents.connection, true);
    return true;
  }

  async disconnect() {
    fuel.emit(FuelWalletEvents.connection, false);
    return false;
  }

  async accounts() {
    const accounts = [userWallet.address.toAddress()];
    fuel.emit(FuelWalletEvents.accounts, accounts);
    return accounts;
  }

  async signMessage(params: {
    account: string;
    message: string;
    address: string;
  }) {
    return userWallet.signMessage(params.message);
  }

  async sendTransaction(params: {
    address: string;
    transaction: string;
    message: string;
  }) {
    const transaction = transactionRequestify(JSON.parse(params.transaction));
    const response = await userWallet.sendTransaction(transaction);
    return response.id;
  }

  async currentAccount() {
    const account = userWallet.address.toAddress();
    fuel.emit(FuelWalletEvents.currentAccount, account);
    return account;
  }

  async assets() {
    const assets = await userWallet.getBalances();
    return assets;
  }

  async addAsset(): Promise<boolean> {
    return true;
  }
}

global.window = {
  addEventListener(event: string, cb: any) {
    events.on(event, cb);
  },
  postMessage(message: any): void {
    events.emit('request', message);
  },
} as any;

export const fuel = new Fuel();
