import { db } from '~/systems/Core';

export type VaultInputs = {
  getVault: {
    key: string;
  };
  addVault: {
    key: string;
    data: string;
  };
  removeVault: {
    key: string;
  };
};

export class VaultService {
  static async getVault(input: VaultInputs['getVault']) {
    return db.transaction('r', db.vaults, async () => {
      const vault = await db.vaults.get(input);
      return vault?.data;
    });
  }

  static async addVault(input: VaultInputs['addVault']) {
    return db.transaction('rw', db.vaults, db.accounts, async () => {
      await db.vaults.add(input);
      return input.data as unknown;
    });
  }

  static async removeVault(input: VaultInputs['removeVault']) {
    return db.transaction('rw', db.vaults, db.accounts, async () => {
      return db.vaults.where(input).delete();
    });
  }

  static async clearVaults() {
    return db.transaction('rw', db.vaults, db.accounts, async () => {
      await db.vaults.clear();
      await db.accounts.clear();
    });
  }
}
