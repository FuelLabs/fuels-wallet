import type { Table } from 'dexie';
import Dexie from 'dexie';

import type { Account, Vault } from '~/systems/Account';
import type { Network } from '~/systems/Network';
import type { Transaction } from '~/systems/Transaction';

export class FuelDB extends Dexie {
  vaults!: Table<Vault, string>;
  accounts!: Table<Account, string>;
  networks!: Table<Network, string>;
  transactions!: Table<Transaction, string>;

  constructor() {
    super('FuelDB');
    this.version(2).stores({
      vaults: `key`,
      accounts: `address`,
      networks: `&id, &url, &name`,
      transactions: `&id`,
    });
  }
}

export const db = new FuelDB();
