/* eslint-disable consistent-return */
import type { Account } from '@fuel-wallet/types';
import { Address, bn, Provider } from 'fuels';

import { isEth } from '~/systems/Asset/utils/asset';
import type { Maybe } from '~/systems/Core/types';
import { db } from '~/systems/Core/utils/database';

export type AccountInputs = {
  addAccount: {
    data: {
      name: string;
      address: string;
      publicKey: string;
      vaultId?: number;
      isHidden?: boolean;
    };
  };
  fetchBalance: {
    providerUrl: string;
    account?: Maybe<Account>;
  };
  fetchAccount: {
    address: string;
  };
  setBalance: {
    data: Pick<Account, 'address' | 'balance' | 'balanceSymbol' | 'balances'>;
  };
  setCurrentAccount: {
    address: string;
  };
  updateAccount: {
    address: string;
    data: Partial<Account>;
  };
  importAccount: {
    name: string;
    privateKey: string;
  };
  exportAccount: {
    address: string;
  };
};

export class AccountService {
  static async addAccount(input: AccountInputs['addAccount']) {
    return db.transaction('rw', db.accounts, async () => {
      const count = await db.accounts.count();
      const account = {
        ...input.data,
        isCurrent: count === 0,
        isHidden: !!input.data.isHidden,
      };
      await db.accounts.add(account);
      return db.accounts.get({
        address: input.data.address,
      }) as Promise<Account>;
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

  static async fetchAccount(input: AccountInputs['fetchAccount']) {
    const { address } = input;
    const account = await db.transaction('r', db.accounts, async () => {
      return db.accounts.get({ address });
    });

    if (!account) {
      throw new Error(`Account not found! ${address}`);
    }

    return account;
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

  static toMap(accounts: Account[]) {
    return accounts.reduce((obj, acc) => ({ ...obj, [acc.address]: acc }), {});
  }

  static fromMap(accountMap: Record<string, Account>) {
    return Object.values(accountMap || {});
  }

  static getCurrentAccount() {
    return db.transaction('r', db.accounts, async () => {
      return (await db.accounts.toArray()).find((account) => account.isCurrent);
    });
  }

  static setCurrentAccount(input: AccountInputs['setCurrentAccount']) {
    return db.transaction('rw', db.accounts, async () => {
      await db.accounts
        .filter((account) => !!account.isCurrent)
        .modify({ isCurrent: false });
      await db.accounts.update(input.address, {
        isCurrent: true,
      });
      return db.accounts.get(input.address) as Promise<Account>;
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

  static async checkAccountNameExists(name: string = '') {
    const accounts = await AccountService.getAccounts();
    const exitsAccountWithName = this.filterByName(accounts, name).length > 0;
    return exitsAccountWithName;
  }

  static filterByName(accounts: Account[], name: string = '') {
    return accounts.filter((account) =>
      account.name.toLowerCase().includes(name.toLowerCase())
    );
  }
}

// ----------------------------------------------------------------------------
// Private methods
// ----------------------------------------------------------------------------

async function getBalances(providerUrl: string, publicKey: string = '0x00') {
  const provider = new Provider(providerUrl!);
  const address = Address.fromPublicKey(publicKey);
  const balances = await provider.getBalances(address);
  return balances;
}
