import { db } from "~/systems/Core";

export class IndexedDBStorage {
  async getItem(key: string) {
    return db.getVault({ key });
  }

  async setItem(key: string, data: string) {
    return db.addVault({ key, data });
  }

  async removeItem(key: string) {
    return db.removeVault({ key });
  }

  async clear() {
    return db.clearVaults();
  }
}
