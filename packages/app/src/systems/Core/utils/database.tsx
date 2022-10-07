import type { Table } from 'dexie';
import Dexie from 'dexie';

import type { Account, Vault } from '~/systems/Account';
import type { Application } from '~/systems/Application/types';
import type { Network } from '~/systems/Network';

export class FuelDB extends Dexie {
  vaults!: Table<Vault, string>;
  accounts!: Table<Account, string>;
  networks!: Table<Network, string>;
  applications!: Table<Application, string>;

  constructor() {
    super('FuelDB');
    this.version(2).stores({
      vaults: `key`,
      accounts: `address`,
      networks: `&id, &url, &name`,
      applications: 'origin',
    });
  }
}

export const db = new FuelDB();
