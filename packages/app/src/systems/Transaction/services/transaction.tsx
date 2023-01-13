/* eslint-disable no-param-reassign */
import type { Account } from '@fuel-wallet/types';
import type { TransactionRequest, WalletUnlocked } from 'fuels';
import { Provider, TransactionResponse } from 'fuels';

import type { Transaction } from '../types';
import { toJSON } from '../utils';

import { db, uniqueId } from '~/systems/Core';
import { graphqlSDK } from '~/systems/Core/utils/graphql';

export type TxInputs = {
  get: {
    id: string;
  };
  add: Omit<Transaction, 'id'>;
  remove: {
    id: string;
  };
  request: {
    transactionRequest: TransactionRequest;
    origin: string;
    providerUrl: string;
  };
  send: {
    transactionRequest: TransactionRequest;
    wallet: WalletUnlocked;
    providerUrl?: string;
  };
  simulateTransaction: {
    transactionRequest: TransactionRequest;
    providerUrl?: string;
  };
  getOutputs: {
    transactionRequest?: TransactionRequest;
    account?: Account | null;
  };
  fetch: {
    txId: string;
    providerUrl?: string;
  };
  getTransactionHistory: {
    address: string;
  };
};

export class TxService {
  static async clear() {
    return db.transaction('rw', db.transactions, async () => {
      return db.transactions.clear();
    });
  }

  static getAll() {
    return db.transaction('r', db.transactions, async () => {
      return db.transactions.toArray();
    });
  }

  static get(input: TxInputs['get']) {
    return db.transaction('r', db.transactions, async () => {
      return db.transactions.where(input).first();
    });
  }

  static add(input: TxInputs['add']) {
    const { type } = input;
    const data = toJSON(input.data!);
    return db.transaction('rw', db.transactions, async () => {
      const id = await db.transactions.add({ type, data, id: uniqueId() });
      return db.transactions.get(id);
    });
  }

  static remove(input: TxInputs['remove']) {
    return db.transaction('rw', db.transactions, async () => {
      const tx = await db.transactions.where(input).first();
      await db.transactions.where(input).delete();
      return tx;
    });
  }

  static async send({
    wallet,
    transactionRequest,
    providerUrl,
  }: TxInputs['send']) {
    wallet.provider = new Provider(providerUrl || '');
    return wallet.sendTransaction(transactionRequest);
  }

  static async fetch({ txId, providerUrl = '' }: TxInputs['fetch']) {
    const provider = new Provider(providerUrl);
    const txResponse = new TransactionResponse(txId, provider);

    return txResponse;
  }

  static async simulateTransaction({
    transactionRequest,
    providerUrl,
  }: TxInputs['simulateTransaction']) {
    const provider = new Provider(providerUrl || '');
    const { receipts } = await provider.call(transactionRequest);

    return receipts;
  }

  static async getTransactionHistory({
    address,
  }: TxInputs['getTransactionHistory']) {
    return graphqlSDK.AddressTransactions({
      owner: address,
      first: 10,
    });
  }
}
