/* eslint-disable consistent-return */
import type { WalletUnlocked } from '@fuel-ts/wallet';
import { WalletLocked } from '@fuel-ts/wallet';
import type { WalletManager } from '@fuel-ts/wallet-manager';
import type { Account } from '@fuel-wallet/types';
import { bn, Address, Provider } from 'fuels';

import { unlockManager } from '../utils/manager';

import { isEth } from '~/systems/Asset/utils/asset';
import type { Maybe } from '~/systems/Core/types';
import { db } from '~/systems/Core/utils/database';
import { getPhraseFromValue } from '~/systems/Core/utils/string';
import { NetworkService } from '~/systems/Network/services';

export type AccountInputs = {
  addAccount: {
    data: {
      name: string;
      address: string;
      publicKey: string;
      isHidden?: boolean;
    };
  };
  fetchBalance: {
    providerUrl: string;
    account?: Maybe<Account>;
  };
  setBalance: {
    data: Pick<Account, 'address' | 'balance' | 'balanceSymbol' | 'balances'>;
  };
  hideAccount: {
    data: Pick<Account, 'address' | 'isHidden'>;
  };
  createManager: {
    data: {
      password?: string;
      mnemonic?: string[];
    };
  };
  addNewAccount: {
    data: {
      name: string;
      manager: WalletManager;
    };
  };
  unlock: {
    account: Account;
    password: string;
  };
  unlockVault: {
    password: string;
  };
  changePassword: {
    oldPassword: string;
    newPassword: string;
  };
  selectAccount: {
    address: string;
  };
  updateAccount: {
    address: string;
    data: Partial<Account>;
  };
};

export class AccountService {
  static async addAccount(input: AccountInputs['addAccount']) {
    return db.transaction('rw', db.accounts, async () => {
      const count = await db.accounts.count();
      const account = {
        ...input.data,
        isSelected: count === 0,
        isHidden: !!input.data.isHidden,
      };
      await db.accounts.add(account);
      return db.accounts.get({ address: input.data.address });
    });
  }

  static async getAccounts() {
    return db.transaction('r', db.accounts, async () => {
      return db.accounts.toCollection().sortBy('name');
    });
  }

  static async clearAccounts() {
    return db.transaction('rw', db.accounts, async () => {
      return db.accounts.clear();
    });
  }

  static async fetchBalance(input: AccountInputs['fetchBalance']) {
    if (!input.account) {
      throw new Error('Account not defined');
    }
    if (!input.providerUrl) {
      throw new Error('Invalid Provider URL');
    }

    const { account, providerUrl } = input;
    try {
      const balances = await getBalances(providerUrl, account.publicKey);
      const ethAsset = balances.find(isEth);
      const ethBalance = ethAsset?.amount;
      const nextAccount = await AccountService.setBalance({
        data: {
          address: account.address || '',
          balance: bn(ethBalance || 0).toString(),
          balanceSymbol: 'ETH',
          balances: balances.map((item) => ({
            ...item,
            amount: item.amount.toString(),
          })),
        },
      });
      return nextAccount ?? account;
    } catch (error) {
      const nextAccount = await AccountService.setBalance({
        data: {
          address: account.address || '',
          balance: bn(0).toString(),
          balanceSymbol: 'ETH',
          balances: [],
        },
      });
      return nextAccount ?? account;
    }
  }

  static async setBalance(input: AccountInputs['setBalance']) {
    if (!db.isOpen()) return;
    return db.transaction('rw!', db.accounts, async () => {
      const { address, ...updateData } = input.data;
      await db.accounts.update(address, updateData);
      return db.accounts.get({ address: input.data.address });
    });
  }

  static async hideAccount(input: AccountInputs['hideAccount']) {
    if (!db.isOpen()) return;
    return db.transaction('rw!', db.accounts, async () => {
      const { address, ...updateData } = input.data;
      await db.accounts.update(address, updateData);
      return db.accounts.get({ address: input.data.address });
    });
  }

  static toMap(accounts: Account[]) {
    return accounts.reduce((obj, acc) => ({ ...obj, [acc.address]: acc }), {});
  }

  static fromMap(accountMap: Record<string, Account>) {
    return Object.values(accountMap || {});
  }

  static async createManager({ data }: AccountInputs['createManager']) {
    if (!data?.password || !data?.mnemonic) {
      throw new Error('Invalid data');
    }

    await db.vaults.clear();

    try {
      const manager = await unlockManager(data.password);
      await manager.addVault({
        type: 'mnemonic',
        secret: getPhraseFromValue(data.mnemonic),
      });
      return manager;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      throw error;
    }
  }

  static async addNewAccount({ data }: AccountInputs['addNewAccount']) {
    const accounts = await this.getAccounts();
    const existingAccount = accounts.find((a) => a.name === data.name);

    if (existingAccount) {
      throw new Error('Account name already exists');
    }

    const manager = data.manager;
    const account = await manager.addAccount();
    // Add new account to database
    const dbAccount = await this.addAccount({
      data: {
        name: data.name,
        address: account.address.toString(),
        publicKey: account.publicKey,
      },
    });
    return dbAccount;
  }

  static async exportVault(input: AccountInputs['unlock']) {
    const manager = await unlockManager(input.password);
    const { secret } = manager.exportVault(0);
    return secret;
  }

  static async unlock(input: AccountInputs['unlock']): Promise<WalletUnlocked> {
    const manager = await unlockManager(input.password);
    const wallet = manager.getWallet(Address.fromString(input.account.address));
    const network = await NetworkService.getSelectedNetwork();
    if (!network) {
      throw new Error('Network not found!');
    }
    wallet.connect(network.url);
    return wallet;
  }

  static async getWalletLocked(): Promise<WalletLocked> {
    const network = await NetworkService.getSelectedNetwork();
    const account = await AccountService.getSelectedAccount();
    if (!network) {
      throw new Error('Network not found!');
    }
    if (!account) {
      throw new Error('Account not found!');
    }
    return new WalletLocked(Address.fromString(account.address), network.url);
  }

  static async unlockVault(
    input: AccountInputs['unlockVault']
  ): Promise<WalletManager> {
    const manager = await unlockManager(input.password);
    return manager;
  }

  static async changePassword(input: AccountInputs['changePassword']) {
    const manager = await unlockManager(input.oldPassword);
    await manager.updatePassphrase(input.oldPassword, input.newPassword);
    return manager.lock();
  }

  static getSelectedAccount() {
    return db.transaction('r', db.accounts, async () => {
      return (await db.accounts.toArray()).find(
        (account) => account.isSelected
      );
    });
  }

  static selectAccount(input: AccountInputs['selectAccount']) {
    return db.transaction('rw', db.accounts, async () => {
      await db.accounts
        .filter((account) => !!account.isSelected)
        .modify({ isSelected: false });
      await db.accounts.update(input.address, {
        isSelected: true,
      });
      return db.accounts.get(input.address);
    });
  }

  static updateAccount(input: AccountInputs['updateAccount']) {
    if (!input.data) {
      throw new Error('Account.data undefined');
    }
    if (!input.address) {
      throw new Error('Account.address undefined');
    }
    return db.transaction('rw', db.accounts, async () => {
      await db.accounts.update(input.address, input.data);
      return db.accounts.get(input.address);
    });
  }
}

// ----------------------------------------------------------------------------
// Private methods
// ----------------------------------------------------------------------------

function getBalances(providerUrl: string, publicKey: string = '0x00') {
  const provider = new Provider(providerUrl!);
  const address = Address.fromPublicKey(publicKey);
  return provider.getBalances(address);
}
