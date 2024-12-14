import type { StorageAbstract } from 'fuels';
import { chromeStorage } from '~/systems/Core/services/chromeStorage';
import { db } from '~/systems/Core/utils/database';

export class IndexedDBStorage implements StorageAbstract {
  async getItem(key: string) {
    const vault = await chromeStorage.vaults.get({ key });
    if (vault?.data?.data) return vault?.data?.data;

    return db.transaction('r', db.vaults, async () => {
      const vault = await db.vaults.get({ key });
      return vault?.data;
    });
  }

  async setItem(key: string, data: string) {
    await chromeStorage.vaults.set({ key, data: { key, data } });
    await db.transaction('rw', db.vaults, db.accounts, async () => {
      await db.vaults.put({ key, data });
    });
  }

  async removeItem(key: string) {
    await chromeStorage.vaults.remove({ key });
    await db.transaction('rw', db.vaults, db.accounts, async () => {
      await db.vaults.where({ key }).delete();
    });
  }

  async clear() {
    await db.transaction('rw', db.vaults, db.accounts, async () => {
      await db.vaults.clear();
      await db.accounts.clear();
    });
  }
}
