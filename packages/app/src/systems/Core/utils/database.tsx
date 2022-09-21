import type { Table } from "dexie";
import Dexie from "dexie";

import type {
  Account,
  AccountInputs,
  Vault,
  VaultInputs,
} from "~/systems/Account";
import { AccountService, VaultService } from "~/systems/Account";

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

  // ---------------------------------------------------------------------------
  // VaultService
  // ---------------------------------------------------------------------------
  getVault(input: VaultInputs["getVault"]) {
    return VaultService.getVault(input);
  }

  addVault(input: VaultInputs["addVault"]) {
    return VaultService.addVault(input);
  }

  removeVault(input: VaultInputs["removeVault"]) {
    return VaultService.removeVault(input);
  }

  clearVaults() {
    return VaultService.clearVaults();
  }

  // ---------------------------------------------------------------------------
  // AccountService
  // ---------------------------------------------------------------------------
  addAccount(input: AccountInputs["addAccount"]) {
    return AccountService.addAccount(input);
  }

  getAccounts() {
    return AccountService.getAccounts();
  }
}

export const db = new FuelDB();
