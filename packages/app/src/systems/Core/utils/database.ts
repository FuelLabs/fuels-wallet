import { createUUID } from '@fuel-wallet/connections';
import type {
  Account,
  Vault,
  Connection,
  NetworkData,
  AssetData,
  AbiTable,
  FuelWalletError,
} from '@fuel-wallet/types';
import type { Table } from 'dexie';
import Dexie from 'dexie';
import 'dexie-observable';
import { DATABASE_VERSION, VITE_FUEL_PROVIDER_URL } from '~/config';
import type { Transaction } from '~/systems/Transaction/types';

export class FuelDB extends Dexie {
  vaults!: Table<Vault, string>;
  accounts!: Table<Account, string>;
  networks!: Table<NetworkData, string>;
  connections!: Table<Connection, string>;
  transactions!: Table<Transaction, string>;
  assets!: Table<AssetData, string>;
  abis!: Table<AbiTable, string>;
  errors!: Table<FuelWalletError, string>;

  constructor() {
    super('FuelDB');
    this.version(DATABASE_VERSION)
      .stores({
        vaults: `key`,
        accounts: `&address, &name`,
        networks: `&id, &url, &name`,
        connections: 'origin',
        transactions: `&id`,
        assets: '&assetId, &name, $symbol',
        abis: '&contractId',
        errors: '&id',
      })
      .upgrade(async (tx) => {
        const networks = tx.table('networks');
        // Clean networks
        await networks.clear();
        // Insert beta-5 network
        await networks.add({
          name: 'Testnet Beta 5',
          url: VITE_FUEL_PROVIDER_URL,
          isSelected: true,
          id: createUUID(),
        });
      });
  }

  async clear() {
    await Promise.all([
      this.vaults.clear(),
      this.accounts.clear(),
      this.networks.clear(),
      this.connections.clear(),
      this.transactions.clear(),
      this.assets.clear(),
      this.abis.clear(),
      this.errors.clear(),
    ]);
  }
}

export const db = new FuelDB();
