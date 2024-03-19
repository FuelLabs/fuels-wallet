import { Signer, WalletManager } from 'fuels';
import { Storage, db } from '~/systems/Core';

import { AccountService } from '../services';
import { IndexedDBStorage } from '../utils';

const signer1 = new Signer(Signer.generatePrivateKey());
const signer2 = new Signer(Signer.generatePrivateKey());
const signer3 = new Signer(Signer.generatePrivateKey());

export const MOCK_ACCOUNTS = [
  {
    name: 'Account 1',
    address: signer1.address.toString(),
    publicKey: signer1.publicKey,
  },
  {
    name: 'Account 2',
    address: signer2.address.toString(),
    publicKey: signer2.publicKey,
  },
  {
    isHidden: true,
    name: 'Account 3',
    address: signer3.address.toString(),
    publicKey: signer3.publicKey,
  },
  {
    name: 'Account 4',
    address: 'fuel10va6297tkerdcn5u8mxjm9emudsmkj85pq5x7t7stkmzmc4nvs3qvn99qz',
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
  const account = await AccountService.addAccount({
    data: {
      name: 'Account 1',
      address: walletAccount.address.toAddress(),
      publicKey: walletAccount.publicKey,
    },
  });

  /**
   * Set account as logged
   */
  Storage.setItem('isLogged', true);

  return { account, password, manager };
}
