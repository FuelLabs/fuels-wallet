import { createUUID } from '@fuel-wallet/connections';
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
import type { DbEvents, PromiseExtended, Table } from 'dexie';
import Dexie from 'dexie';
import 'dexie-observable';
import type { TransactionCursor } from '~/systems/Transaction';
import { applyDbVersioning } from './databaseVersioning';

type FailureEvents = Extract<keyof DbEvents, 'close' | 'blocked'>;

export class FuelDB extends Dexie {
  vaults!: Table<Vault, string>;
  accounts!: Table<Account, string>;
  networks!: Table<NetworkData, string>;
  connections!: Table<Connection, string>;
  transactionsCursors!: Table<TransactionCursor, string>;
  assets!: Table<AssetData, string>;
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

  open(): PromiseExtended<Dexie> {
    try {
      return super.open().then((res) => {
        this.restartAttempts = 0;
        return res;
      });
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
      this.transactionsCursors.clear(),
      this.assets.clear(),
      this.abis.clear(),
      this.errors.clear(),
    ]);
  }
}

export const db = new FuelDB();
