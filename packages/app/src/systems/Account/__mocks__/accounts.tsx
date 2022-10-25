import { WalletManager } from '@fuel-ts/wallet-manager';

import { AccountService } from '../services';
import { IndexedDBStorage } from '../utils';

import { db } from '~/systems/Core';

export const MOCK_ACCOUNTS = [
  {
    name: 'Account 1',
    address: 'fuel0x2c8e117bcfba11c76d7db2d43464b1d2093474ef',
    publicKey: '0x00',
  },
  {
    name: 'Account 2',
    address: 'fuel0x2c8e117bcfba11c76d7db2d43464b1d20934734r',
    publicKey: '0x00',
  },
  {
    name: 'Account 3',
    address: 'fuel0x2c8e117bcfba11c76d7db2d43464b1d209347123',
    isHidden: true,
    publicKey: '0x00',
  },
];

export async function createMockAccount() {
  const secretKey =
    '0xa449b1ffee0e2205fa924c6740cc48b3b473aa28587df6dab12abc245d1f5298';
  const password = '123123123';

  /**
   * Clear database and accounts
   * */
  await db.vaults.clear();
  await AccountService.clearAccounts();

  /**
   * Create a new wallet manager
   * */
  const storage = new IndexedDBStorage() as never;
  const manager = new WalletManager({ storage });
  await manager.unlock(password);

  /**
   * Add Vault
   * */
  await manager.addVault({ type: 'privateKey', secret: secretKey });
  const accounts = manager.getAccounts();
  const walletAccount =
    accounts.find((a) => a.address.toString().startsWith('0x94')) ||
    accounts[0];

  /**
   * Add account on database
   * */
  await AccountService.addAccount({
    data: {
      name: 'Account 1',
      address: walletAccount.address.toAddress(),
      publicKey: walletAccount.publicKey,
    },
  });

  return { password };
}
