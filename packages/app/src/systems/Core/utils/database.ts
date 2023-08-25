import { createUUID } from '@fuel-wallet/sdk';
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
import { bn } from 'fuels';

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
        // Clear networks table
        await tx.table('networks').clear();
        // Add Beta 4 network as default
        await tx.table('networks').add({
          id: createUUID(),
          name: 'Testnet Beta 4',
          url: import.meta.env.VITE_FUEL_PROVIDER_URL,
          isSelected: true,
        });
        // Modify accounts table to set balance to 0
        await tx
          .table('accounts')
          .toCollection()
          .modify((account) => {
            // eslint-disable-next-line no-param-reassign
            account.balance = bn();
            // eslint-disable-next-line no-param-reassign
            account.balances = [];
          });
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
