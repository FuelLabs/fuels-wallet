import type {
  AbiTable,
  Account,
  AssetData,
  Connection,
  DatabaseRestartEvent,
  NetworkData,
  StoredFuelWalletError,
  Vault,
} from '@fuel-wallet/types';
import Dexie, { type DbEvents, type PromiseExtended, type Table } from 'dexie';
import 'dexie-observable';
import type { AssetFuel } from 'fuels';
import type { TransactionCursor } from '~/systems/Transaction';
import { chromeStorage } from '../services/chromeStorage';
import { applyDbVersioning } from './databaseVersioning';

type FailureEvents = Extract<keyof DbEvents, 'close' | 'blocked'>;
export type FuelCachedAsset = AssetData &
  AssetFuel & { key: string; fetchedAt?: number };

export class FuelDB extends Dexie {
  vaults!: Table<Vault, string>;
  accounts!: Table<Account, string>;
  networks!: Table<NetworkData, string>;
  connections!: Table<Connection, string>;
  transactionsCursors!: Table<TransactionCursor, string>;
  assets!: Table<AssetData, string>;
  indexedAssets!: Table<FuelCachedAsset, string>;
  abis!: Table<AbiTable, string>;
  errors!: Table<StoredFuelWalletError, string>;
  integrityCheckInterval?: NodeJS.Timeout;
  restartAttempts = 0;
  readonly alwaysOpen = true;

  constructor() {
    super('FuelDB');
    applyDbVersioning(this);
    this.setupListeners();
  }

  setupListeners() {
    this.on('blocked', () => this.restart('blocked'));
    this.on('close', () => this.restart('close'));
  }

  async createParallelDb() {
    // add table outside of dexie to test if it will be corrupted also with dexie FuelDB
    if (typeof window !== "undefined") {
      const request = await window.indexedDB.open('TestDatabase', 2);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBRequest)?.result;
        db.createObjectStore('myTable', { keyPath: 'id' });
      };
      request.onsuccess = (event: Event) => {
        const db = (event.target as IDBRequest).result as IDBDatabase;
        const tx = db.transaction('myTable', 'readwrite');
        const store = tx.objectStore('myTable');
        
        const countRequest = store.count();
        countRequest.onsuccess = () => {
          if (countRequest.result === 0) {
            store.add({ id: 1, name: 'John' });
          }
        };
      };
    }
  }

  async syncDbToChromeStorage() {
    const accounts = await this.accounts.toArray();
    const vaults = await this.vaults.toArray();
    const networks = await this.networks.toArray();

    // @TODO: this is a temporary solution to avoid the storage accounts of being wrong and
    // users losing funds in case of no backup
    // if has account, save to chrome storage
    if (accounts.length) {
      for (const account of accounts) {
        await chromeStorage.accounts.set({
          key: account.address,
          data: account,
        });
      }
    }
    if (vaults.length) {
      for (const vault of vaults) {
        await chromeStorage.vaults.set({
          key: vault.key,
          data: vault,
        });
      }
    }
    if (networks.length) {
      for (const network of networks) {
        await chromeStorage.networks.set({
          key: network.id || '',
          data: network,
        });
      }
    }
  }

  open(): PromiseExtended<Dexie> {
    try {
      return super.open().then((res) => {
        this.restartAttempts = 0;
        try {
          (() => this.createParallelDb())();
        } catch(_){}

        try {
          (() => this.syncDbToChromeStorage())();
        } catch(_){}

        return res;
      });
    } catch (err) {
      console.error('Failed to restart DB. Sending signal for restart');
      this.restart('blocked');
      throw err;
    }
  }

  async close(opts: { disableAutoOpen?: boolean } = {}) {
    const { disableAutoOpen = false } = opts;
    if (!this.alwaysOpen || disableAutoOpen || this.restartAttempts > 3) {
      this.restartAttempts = 0;
      return;
    }
    this.restartAttempts += 1;
    await this.open().catch(() => this.close(opts));
  }

  async restart(eventName: FailureEvents) {
    if (!this.alwaysOpen) {
      return;
    }
    if (eventName === 'close') {
      clearInterval(this.integrityCheckInterval);
    } else {
      this.close({ disableAutoOpen: true });
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
      chromeStorage.accounts.clear(),
      chromeStorage.networks.clear(),
      chromeStorage.vaults.clear(),
      this.vaults.clear(),
      this.accounts.clear(),
      this.networks.clear(),
      this.connections.clear(),
      this.transactionsCursors.clear(),
      this.assets.clear(),
      this.indexedAssets.clear(),
      this.abis.clear(),
      this.errors.clear(),
    ]);
  }
}

export const db = new FuelDB();
