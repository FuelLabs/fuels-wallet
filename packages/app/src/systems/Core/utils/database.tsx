import type { Table } from "dexie";
import Dexie from "dexie";
import type { CoinQuantity } from "fuels";

import type { Account, Vault } from "~/systems/Account";

type AddAccountData = {
  name: string;
  address: string;
  publicKey: string;
};

type DBCoinBalance = Omit<CoinQuantity, "amount"> & {
  /**
   * We need amount as string here because isn't possible to save
   * bn() values inside IndexedDB
   */
  amount: string;
};

type SetBalanceData = {
  address: string;
  balance: string;
  balanceSymbol: string;
  balances: DBCoinBalance[];
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

  getAccounts() {
    return db.transaction("r", db.accounts, async () => {
      return db.accounts.toArray();
    });
  }

  setBalance(data: SetBalanceData) {
    return db.transaction("rw", db.accounts, async () => {
      const { address, ...updateData } = data;
      await db.accounts.update(address, updateData);
      return db.accounts.get({ address: data.address });
    });
  }
}

export const db = new FuelDB();
