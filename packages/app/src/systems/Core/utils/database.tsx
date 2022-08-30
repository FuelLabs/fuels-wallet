import type { Table } from "dexie";
import Dexie from "dexie";

import type { Account, Vault } from "~/systems/Account";

type AddAccountData = {
  name: string;
  address: string;
};

class FuelDB extends Dexie {
  vaults!: Table<Vault, string>;
  accounts!: Table<Account, string>;

  constructor() {
    super("FuelDB");
    this.version(1).stores({
      vaults: `key`,
      accounts: `address`,
    });
  }

  getVault(key: string) {
    return db.transaction("r", db.vaults, async () => {
      const vault = await db.vaults.get({ key });
      return vault?.data;
    });
  }

  addVault(key: string, data: string) {
    return db.transaction("rw", db.vaults, db.accounts, async () => {
      await db.vaults.add({ key, data });
      return data as unknown;
    });
  }

  removeVault(key: string) {
    return db.transaction("rw", db.vaults, db.accounts, async () => {
      return db.vaults.where({ key }).delete();
    });
  }

  clearVaults() {
    return db.transaction("rw", db.vaults, db.accounts, async () => {
      await db.vaults.clear();
      await db.accounts.clear();
    });
  }

  addAccount(data: AddAccountData) {
    return db.transaction("rw", db.accounts, async () => {
      await db.accounts.add(data);
      return db.accounts.get({ address: data.address });
    });
  }

  getAccount(address: string) {
    return db.transaction("r", db.accounts, async () => {
      return db.accounts.get({ address });
    });
  }
}

export const db = new FuelDB();
