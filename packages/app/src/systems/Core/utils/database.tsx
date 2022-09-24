import type { Table } from "dexie";
import Dexie from "dexie";

import type { Account, Vault } from "~/systems/Account";

export class FuelDB extends Dexie {
  vaults!: Table<Vault, string>;
  accounts!: Table<Account, string>;

  constructor() {
    super("FuelDB");
    this.version(1).stores({
      vaults: `key`,
      accounts: `address`,
    });
  }
}

export const db = new FuelDB();
