import type { WalletUnlocked } from 'fuels';
import { Provider, TransactionResponse } from 'fuels';

import type { Transaction, TxRequest } from '../types';
import { parseTransaction } from '../utils';

import { db, uniqueId } from '~/systems/Core';

export type TxInputs = {
  get: {
    id: string;
  };
  add: Omit<Transaction, 'id'>;
  remove: {
    id: string;
  };
  simulate: {
    wallet: WalletUnlocked;
    tx: TxRequest;
  };
  send: {
    wallet: WalletUnlocked;
    tx: TxRequest;
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
    const data = parseTransaction(input.data!);
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

  static async simulate({ wallet, tx }: TxInputs['simulate']) {
    return wallet.simulateTransaction(tx);
  }

  static async send({ wallet, tx }: TxInputs['send']) {
    return wallet.sendTransaction(tx);
  }

  static async fetch({ txId, providerUrl = '' }: TxInputs['fetch']) {
    const provider = new Provider(providerUrl);
    const txResponse = new TransactionResponse(txId, provider);

    return txResponse;
  }
}
