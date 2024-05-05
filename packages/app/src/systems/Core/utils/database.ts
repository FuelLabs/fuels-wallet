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
    this.on('blocked', () => this.restart('blocked'));
    this.on('close', () => this.restart('close'));
    this.on('message', (e) => {
      console.log('fsk changed', e);
    });
  }

  open() {
    return this.safeOpen().finally(() =>
      this.watchConnection()
    ) as PromiseExtended<Dexie>;
  }

  close(safeClose = false) {
    if (safeClose) {
      this.restartAttempts = 0;
      clearInterval(this.integrityCheckInterval);
    }
    return super.close();
  }

  async safeOpen() {
    try {
      const result = await super.open();
      this.restartAttempts = 0;
      return result;
    } catch (err) {
      console.error('Failed to restart DB. Sending signal for restart');
      this.restart('blocked');
      throw err;
    }
  }

  async ensureDatabaseOpen() {
    if (this.isOpen() && !this.hasBeenClosed() && !this.hasFailed()) return;

    if (this.restartAttempts > 3) {
      console.error('Reached max attempts to open DB. Sending restart signal.');
      this.restart('blocked');
      return;
    }

    this.restartAttempts += 1;
    console.warn('DB is not open. Attempting restart.');
    await this.safeOpen();
  }

  watchConnection() {
    if (!this.alwaysOpen) return;

    clearInterval(this.integrityCheckInterval);
    this.integrityCheckInterval = setInterval(() => {
      this.ensureDatabaseOpen();
    }, 1000);
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
