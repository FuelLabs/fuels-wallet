import type { Table } from "dexie";
import Dexie from "dexie";

import type { Account, Vault } from "~/systems/Account";
import type { Network } from "~/systems/Network";

export class FuelDB extends Dexie {
  vaults!: Table<Vault, string>;
  accounts!: Table<Account, string>;
  networks!: Table<Network, number>;

  constructor() {
    super("FuelDB");
    this.version(1).stores({
      vaults: `key`,
      accounts: `&address`,
      networks: `id++, &url, &name`,
    });
  }
}

export const db = new FuelDB();
