import type { Account, Vault, Connection, Network } from '@fuel-wallet/types';
import type { Table } from 'dexie';
import Dexie from 'dexie';

import 'dexie-observable';
import type { Transaction } from '~/systems/Transaction/types';

export class FuelDB extends Dexie {
  vaults!: Table<Vault, string>;
  accounts!: Table<Account, string>;
  networks!: Table<Network, string>;
  connections!: Table<Connection, string>;
  transactions!: Table<Transaction, string>;

  constructor() {
    super('FuelDB');
    this.version(8).stores({
      vaults: `key`,
      accounts: `&address, &name`,
      networks: `&id, &url, &name`,
      connections: 'origin',
      transactions: `&id`,
    });
  }

  clear() {
    return Promise.all([
      this.vaults.clear(),
      this.accounts.clear(),
      this.transactions.clear(),
      this.connections.clear(),
      this.networks.clear(),
    ]);
  }
}

export const db = new FuelDB();
