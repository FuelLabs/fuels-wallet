import type { Account, Vault, Connection, Network } from '@fuel-wallet/types';
import type { Table } from 'dexie';
import Dexie from 'dexie';

import 'dexie-observable';
import { IS_TEST } from '~/config';
import type { Transaction } from '~/systems/Transaction/types';

export class FuelDB extends Dexie {
  vaults!: Table<Vault, string>;
  accounts!: Table<Account, string>;
  networks!: Table<Network, string>;
  connections!: Table<Connection, string>;
  transactions!: Table<Transaction, string>;

  constructor() {
    super('FuelDB');
    this.version(7).stores({
      vaults: `key`,
      accounts: `address`,
      networks: `&id, &url, &name`,
      connections: 'origin',
      transactions: `&id`,
    });
  }
}

export const db = new FuelDB();

// On development expose fuelDB on window
// To enable database manipulation
if (IS_TEST) {
  if (typeof window === 'object') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.fuelDB = db;
  }
}
