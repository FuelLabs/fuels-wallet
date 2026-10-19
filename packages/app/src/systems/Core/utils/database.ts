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
import { type AssetFuel, DEVNET_NETWORK_URL } from 'fuels';
import { IS_LOGGED_KEY } from '~/config';
import { createParallelDb } from '~/systems/Core/utils/databaseNoDexie';
import { Storage } from '~/systems/Core/utils/storage';
import type { TransactionCursor } from '~/systems/Transaction';
import { chromeStorage } from '../services/chromeStorage';
import { applyDbVersioning } from './databaseVersioning';
import { saveToOPFS } from './opfs';

type FailureEvents = Extract<keyof DbEvents, 'close' | 'blocked'>;
export type FuelCachedAsset = AssetData &
  AssetFuel & { key: string; fetchedAt?: number; notFound?: boolean };
type BackupData = {
  accounts: Account[];
  vaults: Vault[];
  networks: NetworkData[];
};

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

  async getBackupData() {
    const accounts = await this.accounts.toArray();
    const vaults = await this.vaults.toArray();
    const networks = await this.networks.toArray();
    return { accounts, vaults, networks };
  }

  async syncDbToOPFS(backupData?: BackupData) {
    await saveToOPFS(backupData ?? (await this.getBackupData()));
  }

  async syncDbToChromeStorage(backupData?: BackupData) {
    const { accounts, vaults, networks } =
      backupData ?? (await this.getBackupData());

    // @TODO: this is a temporary solution to avoid the storage accounts of being wrong and
    // users losing funds in case of no backup
    // if has account, save to chrome storage
    if (accounts.length && vaults.length && networks.length) {
      await chromeStorage.accounts.bulkSet(
        accounts.map((account) => ({ key: account.address, data: account }))
      );
      await chromeStorage.vaults.bulkSet(
        vaults.map((vault) => ({ key: vault.key, data: vault }))
      );
      await chromeStorage.networks.bulkSet(
        networks.map((network) => ({ key: network.id || '', data: network }))
      );
      // bulkSet only upserts, so the devnet row that v31 deleted stays in the
      // backup and recovery would restore it
      if (!networks.some((network) => network.url === DEVNET_NETWORK_URL)) {
        const rows = await chromeStorage.networks.getAll();
        const devnet = rows.find((row) => row.data.url === DEVNET_NETWORK_URL);
        if (devnet) await chromeStorage.networks.remove({ key: devnet.key });
      }
    }
  }

  // Backups are only written when their content differs from what is stored
  async syncBackups() {
    const backupData = await this.getBackupData();
    await Promise.allSettled([
      this.syncDbToChromeStorage(backupData),
      this.syncDbToOPFS(backupData),
    ]);
  }

  open(): PromiseExtended<Dexie> {
    try {
      return super.open().then((res) => {
        this.restartAttempts = 0;
        try {
          (() => createParallelDb())();
        } catch (_) {}

        this.syncBackups().catch(() => {});

        try {
          (async () => {
            const accounts = await this.accounts.toArray();
            if (accounts.length) {
              Storage.setItem(IS_LOGGED_KEY, true);
            }
          })();
        } catch (_) {}

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
