/* eslint-disable no-param-reassign */
import type { Account } from '@fuel-wallet/types';
import type { TransactionRequest, WalletUnlocked } from 'fuels';
import {
  Provider,
  TransactionResponse,
  bn,
  calculateTransactionFee,
} from 'fuels';

import type { Transaction } from '../types';
import { getOutputsCoin, toJSON } from '../utils';

import { db, uniqueId } from '~/systems/Core';

export type TxInputs = {
  get: {
    id: string;
  };
  add: Omit<Transaction, 'id'>;
  remove: {
    id: string;
  };
  request: {
    tx: TransactionRequest;
    origin: string;
    providerUrl: string;
  };
  send: {
    tx: TransactionRequest;
    wallet: WalletUnlocked;
    providerUrl?: string;
  };
  calculateFee: {
    tx: TransactionRequest;
    providerUrl?: string;
  };
  fetchGasPrice: {
    providerUrl?: string;
  };
  getOutputs: {
    tx?: TransactionRequest;
    account?: Account | null;
  };
  fetch: {
    txId: string;
    providerUrl?: string;
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

  static async send({ wallet, tx, providerUrl }: TxInputs['send']) {
    wallet.provider = new Provider(providerUrl || '');
    return wallet.sendTransaction(tx);
  }

  static async fetch({ txId, providerUrl = '' }: TxInputs['fetch']) {
    const provider = new Provider(providerUrl);
    const txResponse = new TransactionResponse(txId, provider);

    return txResponse;
  }

  static async calculateFee({ tx, providerUrl }: TxInputs['calculateFee']) {
    const { gasPrice } = tx;
    const provider = new Provider(providerUrl || '');
    const { receipts } = await provider.call(tx);
    const result = calculateTransactionFee({ receipts, gasPrice });
    return result.fee;
  }

  static async fetchGasPrice({ providerUrl }: TxInputs['fetchGasPrice']) {
    const provider = new Provider(providerUrl || '');
    const { minGasPrice } = await provider.getNodeInfo();
    return minGasPrice;
  }

  static getOutputs({ tx, account }: TxInputs['getOutputs']) {
    const coinOutputs = getOutputsCoin(tx);
    const outputsToSend = coinOutputs.filter(
      (value) => value.to !== account?.publicKey
    );
    const outputAmount = outputsToSend.reduce(
      (acc, value) => acc.add(value.amount),
      bn(0)
    );

    return { coinOutputs, outputsToSend, outputAmount };
  }
}
