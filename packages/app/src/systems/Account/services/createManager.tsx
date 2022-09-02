import { WalletManager } from "@fuel-ts/wallet-manager";

import { IndexedDBStorage } from "../utils";

import { db, getPhraseFromValue } from "~/systems/Core";

type CreateManagerData = {
  password?: string;
  mnemonic?: string[];
};

export async function createManager(data: CreateManagerData) {
  if (!data?.password || !data?.mnemonic) {
    throw new Error("Invalid data");
  }

  await db.clearVaults();

  /**
   * TODO: this is needed because of a typing error with StorageAbstract from fuels-ts
   */
  const storage = new IndexedDBStorage() as never;
  const manager = new WalletManager({ storage });

  try {
    await manager.unlock(data.password);
    await manager.addVault({
      type: "mnemonic",
      secret: getPhraseFromValue(data.mnemonic),
    });
    return manager;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
}
