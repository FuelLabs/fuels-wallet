/* eslint-disable @typescript-eslint/no-explicit-any */

import { PAGE_SCRIPT_NAME } from '@fuel-wallet/types';
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
      this.accounts,
      this.signMessage,
      this.sendTransaction,
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

  async connect() {
    return true;
  }

  async disconnect() {
    return false;
  }

  async accounts() {
    return [userWallet.address.toAddress()];
  }

  async signMessage(params: { account: string; message: string }) {
    return userWallet.signMessage(params.message);
  }

  async sendTransaction(params: { transaction: string; message: string }) {
    const transaction = transactionRequestify(JSON.parse(params.transaction));
    const response = await userWallet.sendTransaction(transaction);
    return response.id;
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
