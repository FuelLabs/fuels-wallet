import type { StorageAbstract } from '@fuel-ts/account';
import { db } from '~/systems/Core/utils/database';

export class IndexedDBStorage implements StorageAbstract {
  async getItem(key: string) {
    return db.transaction('r', db.vaults, async () => {
      const vault = await db.vaults.get({ key });
      return vault?.data;
    });
  }

  async setItem(key: string, data: string) {
    await db.transaction('rw', db.vaults, db.accounts, async () => {
      await db.vaults.put({ key, data });
    });
  }

  async removeItem(key: string) {
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
