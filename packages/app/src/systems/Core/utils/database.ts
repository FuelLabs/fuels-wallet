import { createUUID } from '@fuel-wallet/connections';
import type {
  AbiTable,
  Account,
  AssetData,
  Connection,
  DatabaseRestartEvent,
  FuelWalletError,
  NetworkData,
  Vault,
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
  readonly alwaysOpen = true;

  constructor() {
    super('FuelDB');
    this.version(DATABASE_VERSION)
      .stores({
        vaults: 'key',
        accounts: '&address, &name',
        networks: '&id, &url, &name',
        connections: 'origin',
        transactions: '&id',
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
    this.on('blocked', () => this.restart('closed'));
    this.on('close', () => this.restart('blocked'));
  }

  async restart(eventName: 'blocked' | 'closed') {
    if (!this.alwaysOpen) {
      return;
    }
    if (eventName !== 'closed') {
      this.close();
    }

    this.open();

    chrome.runtime.sendMessage({
      type: 'DB_EVENT',
      payload: {
        event: 'restarted',
      },
    } as DatabaseRestartEvent);
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
