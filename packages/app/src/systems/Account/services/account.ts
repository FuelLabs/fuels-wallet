import { createProvider } from '@fuel-wallet/connections';
import type {
  Account,
  AccountBalance,
  AccountWithBalance,
  CoinAsset,
} from '@fuel-wallet/types';
import * as Sentry from '@sentry/react';
import { Address, type Provider, bn } from 'fuels';
import { AssetsCache } from '~/systems/Asset/cache/AssetsCache';
import { chromeStorage } from '~/systems/Core/services/chromeStorage';
import type { Maybe } from '~/systems/Core/types';
import { db } from '~/systems/Core/utils/database';
import { getUniqueString } from '~/systems/Core/utils/string';
import { getTestNoDexieDbData } from '../utils/getTestNoDexieDbData';

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

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
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
      return db.accounts.get({
        address: Address.fromString(address).toString(),
      });
    });

    if (!account) {
      throw new Error(`Account not found! ${address}`);
    }

    return account;
  }

  static async fetchBalance(
    input: AccountInputs['fetchBalance']
  ): Promise<AccountWithBalance> {
    if (!input.account) {
      throw new Error('Account not defined');
    }
    if (!input.providerUrl) {
      throw new Error('Invalid Provider URL');
    }

    const { account, providerUrl } = input;

    try {
      const provider = await createProvider(providerUrl!);
      const balances = await getBalances(provider, account.publicKey);
      const balanceAssets = await AssetsCache.fetchAllAssets(
        provider.getChainId(),
        balances.map((balance) => balance.assetId)
      );
      // includes "asset" prop in balance, centralizing the complexity here instead of in rest of UI
      const nextBalancesWithAssets = await balances.reduce(
        async (acc, balance) => {
          const prev = await acc;
          const cachedAsset = balanceAssets.get(balance.assetId);

          return [
            ...prev,
            {
              ...balance,
              amount: balance.amount,
              asset: cachedAsset,
            },
          ];
        },
        Promise.resolve([] as CoinAsset[])
      );
      nextBalancesWithAssets.sort((a, b) => {
        // if asset.symbol is "ETH" then it will be should be first
        if (a.asset?.symbol === 'ETH') return -1;

        const aName = a.asset?.name?.toLowerCase() ?? '';
        const bName = b.asset?.name?.toLowerCase() ?? '';
        // sort ascendant by asset.name
        if (aName > bName) return -1;
        if (bName > aName) return 1;

        return 0;
      });

      // includes eth balance info, centralizing the complexity here instead of in rest of UI
      const baseAssetId = provider.getBaseAssetId();
      const ethAsset = balances.find(
        (balance) => balance.assetId === baseAssetId.toString()
      );
      const ethBalance = ethAsset?.amount;
      const accountAssets: AccountBalance = {
        balance: ethBalance ?? bn(0),
        balanceSymbol: 'ETH',
        balances: nextBalancesWithAssets,
      };

      const result: AccountWithBalance = {
        ...account,
        ...accountAssets,
      };

      return result;
    } catch (_error) {
      const accountAssets: AccountBalance = {
        balance: bn(0),
        balanceSymbol: 'ETH',
        balances: [],
      };
      const result: AccountWithBalance = {
        ...account,
        ...accountAssets,
      };

      return result;
    }
  }

  static toMap(accounts: Account[]) {
    // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
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

  static setCurrentAccountToFalse() {
    return db.transaction('rw', db.accounts, async () => {
      await db.accounts
        .filter((account) => !!account.isCurrent)
        .modify({ isCurrent: false });
    });
  }

  static async setCurrentAccountToDefault() {
    return db.transaction('rw', db.accounts, async () => {
      const [firstAccount] = await db.accounts.toArray();
      if (firstAccount) {
        await db.accounts
          .filter((account) => account.address === firstAccount.address)
          .modify({ isCurrent: true });
      }
    });
  }

  static async fetchRecoveryState() {
    const [
      backupAccounts,
      allAccounts,
      backupVaults,
      allVaults,
      backupNetworks,
      allNetworks,
    ] = await Promise.all([
      chromeStorage.accounts.getAll(),
      db.accounts.toArray(),
      chromeStorage.vaults.getAll(),
      db.vaults.toArray(),
      chromeStorage.networks.getAll(),
      db.networks.toArray(),
    ]);

    // if there is no accounts, means the user lost it. try recovering it
    const needsAccRecovery =
      allAccounts?.length === 0 && backupAccounts?.length > 0;
    const needsVaultRecovery =
      allVaults?.length === 0 && backupVaults?.length > 0;
    const needsNetworkRecovery =
      allNetworks?.length === 0 && backupNetworks?.length > 0;
    const needsRecovery =
      needsAccRecovery || needsVaultRecovery || needsNetworkRecovery;

    return {
      backupAccounts,
      backupVaults,
      backupNetworks,
      needsRecovery,
      needsAccRecovery,
      needsVaultRecovery,
      needsNetworkRecovery,
    };
  }

  static async recoverWallet() {
    const {
      backupAccounts,
      backupVaults,
      backupNetworks,
      needsRecovery,
      needsAccRecovery,
      needsVaultRecovery,
      needsNetworkRecovery,
    } = await AccountService.fetchRecoveryState();

    if (needsRecovery) {
      (async () => {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const dataToLog: any = {};
        try {
          dataToLog.backupAccounts = JSON.stringify(
            backupAccounts?.map((account) => account?.data?.address) || []
          );
          dataToLog.backupNetworks = JSON.stringify(backupNetworks || []);
          // try getting data from indexedDB (outside of dexie) to check if it's also corrupted
          const testNoDexieDbData = await getTestNoDexieDbData();
          dataToLog.testNoDexieDbData = testNoDexieDbData;
        } catch (_) {}

        Sentry.captureException(
          'Disaster on DB. Start recovering accounts / vaults / networks',
          {
            extra: dataToLog,
            tags: { manual: true },
          }
        );
      })();

      await db.transaction(
        'rw',
        db.accounts,
        db.vaults,
        db.networks,
        async () => {
          if (needsAccRecovery) {
            let isCurrentFlag = true;
            console.log('recovering accounts', backupAccounts);
            for (const account of backupAccounts) {
              // in case of recovery, the first account will be the current
              if (account.key && account.data.address) {
                await db.accounts.add({
                  ...account.data,
                  isCurrent: isCurrentFlag,
                });
                isCurrentFlag = false;
              }
            }
          }
          if (needsVaultRecovery) {
            console.log('recovering vaults', backupVaults);
            for (const vault of backupVaults) {
              if (vault.key && vault.data) {
                await db.vaults.add(vault.data);
              }
            }
          }
          if (needsNetworkRecovery) {
            console.log('recovering networks', backupNetworks);
            for (const network of backupNetworks) {
              if (network.key && network.data.id) {
                await db.networks.add(network.data);
              }
            }
          }
        }
      );
    }
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

  static async checkAccountNameExists(name = '') {
    const accounts = await AccountService.getAccounts();
    const existsAccountWithName =
      AccountService.existsAccountWithName(accounts, name).length > 0;
    return existsAccountWithName;
  }

  static async generateAccountName() {
    const accounts = await AccountService.getAccounts();
    const count = accounts.length;
    const desiredName = `Account ${count + 1}`;
    const allNames = accounts.map(({ name }) => name);
    const name = getUniqueString({
      desired: desiredName,
      allValues: allNames,
    });
    return name || desiredName;
  }

  static filterByName(accounts: Account[], name = '') {
    return accounts.filter((account) =>
      account.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  static existsAccountWithName(accounts: Account[], name = '') {
    return accounts.filter((account) => {
      return account.name === name;
    });
  }
}

// ----------------------------------------------------------------------------
// Private methods
// ----------------------------------------------------------------------------

async function getBalances(provider: Provider, publicKey = '0x00') {
  const address = Address.fromPublicKey(publicKey);
  const { balances } = await provider.getBalances(address);
  return balances;
}
