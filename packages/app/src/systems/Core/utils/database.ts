import type {
  Account,
  Vault,
  Connection,
  Network,
  Asset,
  AbiTable,
  FuelWalletError,
} from '@fuel-wallet/types';
import type { Table } from 'dexie';
import Dexie from 'dexie';

import 'dexie-observable';
import { DATABASE_VERSION } from '~/config';
import type { Transaction } from '~/systems/Transaction/types';

export class FuelDB extends Dexie {
  vaults!: Table<Vault, string>;
  accounts!: Table<Account, string>;
  networks!: Table<Network, string>;
  connections!: Table<Connection, string>;
  transactions!: Table<Transaction, string>;
  assets!: Table<Asset, string>;
  abis!: Table<AbiTable, string>;
  errors!: Table<FuelWalletError, string>;

  constructor() {
    super('FuelDB');
    this.version(DATABASE_VERSION).stores({
      vaults: `key`,
      accounts: `&address, &name`,
      networks: `&id, &url, &name`,
      connections: 'origin',
      transactions: `&id`,
      assets: '&assetId, &name, $symbol',
      abis: '&contractId',
      errors: '&id',
    });
  }

  async clear() {
    await Promise.all([
      this.vaults.clear(),
      this.accounts.clear(),
      this.transactions.clear(),
      this.connections.clear(),
      this.networks.clear(),
      this.abis.clear(),
      this.errors.clear(),
    ]);
  }
}

export const db = new FuelDB();
