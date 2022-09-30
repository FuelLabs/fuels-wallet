import { db } from '~/systems/Core';

export class IndexedDBStorage {
  async getItem(key: string) {
    return db.transaction('r', db.vaults, async () => {
      const vault = await db.vaults.get({ key });
      return vault?.data;
    });
  }

  async setItem(key: string, data: string) {
    return db.transaction('rw', db.vaults, db.accounts, async () => {
      await db.vaults.add({ key, data });
      return data as unknown;
    });
  }

  async removeItem(key: string) {
    return db.transaction('rw', db.vaults, db.accounts, async () => {
      return db.vaults.where({ key }).delete();
    });
  }

  async clear() {
    return db.transaction('rw', db.vaults, db.accounts, async () => {
      await db.vaults.clear();
      await db.accounts.clear();
    });
  }
}
