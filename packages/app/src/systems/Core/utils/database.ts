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
import type { DbEvents, PromiseExtended, Table } from 'dexie';
import Dexie from 'dexie';
import 'dexie-observable';
import { DEVNET_NETWORK_URL, TESTNET_NETWORK_URL } from 'fuels';
import { DATABASE_VERSION, VITE_FUEL_PROVIDER_URL } from '~/config';
import type { Transaction } from '~/systems/Transaction/types';

type FailureEvents = Extract<keyof DbEvents, 'close' | 'blocked'>;

export class FuelDB extends Dexie {
  vaults!: Table<Vault, string>;
  accounts!: Table<Account, string>;
  networks!: Table<NetworkData, string>;
  connections!: Table<Connection, string>;
  transactions!: Table<Transaction, string>;
  assets!: Table<AssetData, string>;
  abis!: Table<AbiTable, string>;
  errors!: Table<FuelWalletError, string>;
  integrityCheckInterval?: NodeJS.Timeout;
  restartAttempts = 0;
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
        assets: '&assetId, &name, &symbol',
        abis: '&contractId',
        errors: '&id',
      })
      .upgrade(async (tx) => {
        const networks = tx.table('networks');
        // Clean networks
        await networks.clear();
        // Insert testnet network
        await networks.add({
          name: 'Fuel Sepolia Testnet',
          url: TESTNET_NETWORK_URL,
          isSelected: true,
          id: createUUID(),
        });
        await networks.add({
          name: 'Fuel Ignition Sepolia Devnet',
          url: DEVNET_NETWORK_URL,
          isSelected: false,
          id: createUUID(),
        });
      });
    this.on('blocked', () => this.restart('blocked'));
    this.on('close', () => this.restart('close'));
  }

  open(): PromiseExtended<Dexie> {
    try {
      const result = super.open();
      this.restartAttempts = 0;
      return result;
    } catch (err) {
      console.error('Failed to restart DB. Sending signal for restart');
      this.restart('blocked');
      throw err;
    }
  }

  async close(safeClose = false) {
    if (!this.alwaysOpen || safeClose || this.restartAttempts > 3) {
      this.restartAttempts = 0;
      return super.close();
    }
    this.restartAttempts += 1;
    await this.open().catch(() => this.close());
  }

  async restart(eventName: FailureEvents) {
    if (!this.alwaysOpen) {
      return;
    }
    if (eventName === 'close') {
      clearInterval(this.integrityCheckInterval);
    } else {
      this.close(true);
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
