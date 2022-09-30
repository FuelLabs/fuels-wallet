/* eslint-disable consistent-return */
import { WalletManager } from '@fuel-ts/wallet-manager';
import type { CoinQuantity } from 'fuels';
import { bn, Address, Provider } from 'fuels';

import type { Account } from '../types';
import { IndexedDBStorage } from '../utils';

import { ASSET_LIST } from '~/systems/Asset';
import type { Maybe } from '~/systems/Core';
import { getPhraseFromValue, db } from '~/systems/Core';

type DBCoinBalance = Omit<CoinQuantity, 'amount'> & {
  /**
   * We need amount as string here because isn't possible to save
   * bn() values inside IndexedDB
   */
  amount: string;
};

export type AccountInputs = {
  addAccount: {
    data: {
      name: string;
      address: string;
      publicKey: string;
    };
  };
  fetchBalance: {
    providerUrl: string;
    account?: Maybe<Account>;
  };
  setBalance: {
    data: {
      address: string;
      balance: string;
      balanceSymbol: string;
      balances: DBCoinBalance[];
    };
  };
  createManager: {
    data: {
      password?: string;
      mnemonic?: string[];
    };
  };
};

export class AccountService {
  static async addAccount(input: AccountInputs['addAccount']) {
    return db.transaction('rw', db.accounts, async () => {
      await db.accounts.add(input.data);
      return db.accounts.get({ address: input.data.address });
    });
  }

  static async getAccounts() {
    return db.transaction('r', db.accounts, async () => {
      return db.accounts.toArray();
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
      const ethAsset = balances.find(({ assetId }) => assetId === ASSET_LIST[0].assetId);
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

  static async createManager({ data }: AccountInputs['createManager']) {
    if (!data?.password || !data?.mnemonic) {
      throw new Error('Invalid data');
    }

    await db.vaults.clear();

    /**
     * TODO: this is needed because of a typing error with StorageAbstract from fuels-ts
     */
    const storage = new IndexedDBStorage() as never;
    const manager = new WalletManager({ storage });

    try {
      await manager.unlock(data.password);
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
}

// ----------------------------------------------------------------------------
// Private methods
// ----------------------------------------------------------------------------

function getBalances(providerUrl: string, publicKey: string = '0x00') {
  const provider = new Provider(providerUrl!);
  const address = Address.fromPublicKey(publicKey);
  return provider.getBalances(address);
}
