import type { Account, Vault, Application, Network } from '@fuels-wallet/types';
import type { Table } from 'dexie';
import Dexie from 'dexie';
import 'dexie-observable';

import type { Transaction } from '~/systems/Transaction';

export class FuelDB extends Dexie {
  vaults!: Table<Vault, string>;
  accounts!: Table<Account, string>;
  networks!: Table<Network, string>;
  applications!: Table<Application, string>;
  transactions!: Table<Transaction, string>;

  constructor() {
    super('FuelDB');
    this.version(6).stores({
      vaults: `key`,
      accounts: `address`,
      networks: `&id, &url, &name`,
      applications: 'origin',
      transactions: `&id`,
    });
  }
}

export const db = new FuelDB();
