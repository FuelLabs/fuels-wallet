import { WalletManager } from '@fuel-ts/wallet-manager';
import { Wallet } from 'fuels';

import { AccountService } from '../services';
import { IndexedDBStorage } from '../utils';

import { db } from '~/systems/Core';

const wallet1 = Wallet.generate();
const wallet2 = Wallet.generate();
const wallet3 = Wallet.generate();

export const MOCK_ACCOUNTS = [
  {
    name: 'Account 1',
    address: wallet1.address.toString(),
    publicKey: wallet1.publicKey,
  },
  {
    name: 'Account 2',
    address: wallet2.address.toString(),
    publicKey: wallet2.publicKey,
  },
  {
    isHidden: true,
    name: 'Account 3',
    address: wallet3.address.toString(),
    publicKey: wallet3.publicKey,
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
  const account = await AccountService.addAccount({
    data: {
      name: 'Account 1',
      address: walletAccount.address.toAddress(),
      publicKey: walletAccount.publicKey,
    },
  });

  return { account, password, manager };
}
