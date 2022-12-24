import { WalletManager } from '@fuel-ts/wallet-manager';

import { IndexedDBStorage } from './storage';

export async function unlockManager(password: string) {
  const storage = new IndexedDBStorage();
  const manager = new WalletManager({ storage });
  await manager.unlock(password);
  return manager;
}
