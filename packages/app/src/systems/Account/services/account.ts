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
import { convertAsset } from '~/systems/Asset/services/convert-asset';
import { chromeStorage } from '~/systems/Core/services/chromeStorage';
import type { Maybe } from '~/systems/Core/types';
import { db } from '~/systems/Core/utils/database';
import { readFromOPFS } from '~/systems/Core/utils/opfs';
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
      const balances = await getBalances(provider, account.address);
      const convertedRates: Record<string, string | undefined> = {};
      const chainId = provider.getChainId();

      const balanceAssets = AssetsCache.fetchAllAssets(
        chainId,
        balances.map((balance) => balance.assetId)
      );
      const convertRatesPromise = balances.map((asset) => {
        return convertAsset(
          chainId,
          asset.assetId,
          asset.amount.toString()
        ).then((rate) => {
          convertedRates[asset.assetId] = rate?.amount;
        });
      });
      await Promise.all([...convertRatesPromise, balanceAssets]);
      // includes "asset" prop in balance, centralizing the complexity here instead of in rest of UI
      const nextBalancesWithAssets = await balances.reduce(
        async (acc, balance) => {
          const prev = await acc;
          const cachedAsset = (await balanceAssets)?.get(balance.assetId);

          return [
            ...prev,
            {
              ...balance,
              amount: balance.amount,
              asset: cachedAsset,
              convertedRate: convertedRates[balance.assetId],
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
        convertedRate: convertedRates[baseAssetId.toString()],
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
        convertedRate: '',
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
      opfsBackupData,
    ] = await Promise.all([
      chromeStorage.accounts.getAll(),
      db.accounts.toArray(),
      chromeStorage.vaults.getAll(),
      db.vaults.toArray(),
      chromeStorage.networks.getAll(),
      db.networks.toArray(),
      readFromOPFS(),
    ]);

    const chromeStorageBackupData = {
      accounts: backupAccounts,
      vaults: backupVaults,
      networks: backupNetworks,
    };

    // if there is no accounts, means the user lost it. try recovering it
    const needsAccRecovery =
      allAccounts?.length === 0 &&
      (chromeStorageBackupData.accounts?.length > 0 ||
        opfsBackupData?.accounts?.length > 0);
    const needsVaultRecovery =
      allVaults?.length === 0 &&
      (chromeStorageBackupData.vaults?.length > 0 ||
        opfsBackupData?.vaults?.length > 0);
    const needsNetworkRecovery =
      allNetworks?.length === 0 &&
      (chromeStorageBackupData.networks?.length > 0 ||
        opfsBackupData?.networks?.length > 0);
    const needsRecovery =
      needsAccRecovery || needsVaultRecovery || needsNetworkRecovery;

    return {
      needsRecovery,
      needsAccRecovery,
      needsVaultRecovery,
      needsNetworkRecovery,
      chromeStorageBackupData,
      opfsBackupData,
    };
  }

  static async recoverWallet() {
    const { chromeStorageBackupData, needsRecovery, opfsBackupData } =
      await AccountService.fetchRecoveryState();

    if (needsRecovery) {
      (async () => {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const dataToLog: any = {};
        try {
          dataToLog.chromeStorageBackupData = {
            ...chromeStorageBackupData,
            accounts:
              chromeStorageBackupData.accounts?.map(
                (account) => account?.data?.address
              ) || [],
            vaults: chromeStorageBackupData.vaults?.length || 0,
          };
          // try getting data from indexedDB (outside of dexie) to check if it's also corrupted
          const testNoDexieDbData = await getTestNoDexieDbData();
          dataToLog.testNoDexieDbData = testNoDexieDbData;
        } catch (_) {}
        try {
          dataToLog.ofpsBackupupData = {
            ...opfsBackupData,
            accounts:
              opfsBackupData.accounts?.map(
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                (account: any) => account?.address
              ) || [],
            vaults: opfsBackupData.vaults?.length || 0,
          };
        } catch (_) {}

        const hasOPFSBackup =
          !!opfsBackupData?.accounts?.length ||
          !!opfsBackupData?.vaults?.length ||
          !!opfsBackupData?.networks?.length;
        const hasChromeStorageBackup =
          !!chromeStorageBackupData.accounts?.length ||
          !!chromeStorageBackupData.vaults?.length ||
          !!chromeStorageBackupData.networks?.length;
        let sentryMsg = 'DB is cleaned. ';
        if (!hasOPFSBackup && !hasChromeStorageBackup) {
          sentryMsg += 'No backup found. ';
        }
        if (hasOPFSBackup) {
          sentryMsg += 'OPFS backup is found. Recovering...';
        }
        if (hasChromeStorageBackup) {
          sentryMsg += 'Chrome Storage backup is found. Recovering...';
        }

        Sentry.captureException(sentryMsg, {
          extra: dataToLog,
          tags: { manual: true },
        });
      })();

      await db.transaction(
        'rw',
        db.accounts,
        db.vaults,
        db.networks,
        async () => {
          console.log('opfsBackupData', opfsBackupData);
          console.log('chromeStorageBackupData', chromeStorageBackupData);
          // accounts recovery
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          async function recoverAccounts(accounts: any) {
            await db.accounts.clear();
            for (const account of accounts) {
              // in case of recovery, the first account will be the current
              if (account.address) {
                await db.accounts.add(account);
              }
            }
          }
          // vaults recovery
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          async function recoverVaults(vaults: any) {
            await db.vaults.clear();
            for (const vault of vaults) {
              if (vault.key) {
                await db.vaults.add(vault);
              }
            }
          }
          // networks recovery
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          async function recoverNetworks(networks: any) {
            await db.networks.clear();
            for (const network of networks) {
              if (network.url) {
                await db.networks.add(network);
              }
            }
          }

          if (opfsBackupData?.accounts?.length) {
            console.log(
              'recovering accounts from OPFS',
              opfsBackupData.accounts
            );
            await recoverAccounts(opfsBackupData.accounts);
          } else if (chromeStorageBackupData.accounts?.length) {
            console.log(
              'recovering accounts from Chrome Storage',
              chromeStorageBackupData.accounts
            );
            await recoverAccounts(
              chromeStorageBackupData.accounts?.map((account) => account.data)
            );
          }

          if (opfsBackupData?.vaults?.length) {
            console.log('recovering vaults from OPFS', opfsBackupData.vaults);
            await recoverVaults(opfsBackupData.vaults);
          } else if (chromeStorageBackupData.vaults?.length) {
            console.log(
              'recovering vaults from Chrome Storage',
              chromeStorageBackupData.vaults
            );
            await recoverVaults(
              chromeStorageBackupData.vaults?.map((vault) => vault.data)
            );
          }

          if (opfsBackupData?.networks?.length) {
            console.log(
              'recovering networks from OPFS',
              opfsBackupData.networks
            );
            await recoverNetworks(opfsBackupData.networks);
          } else if (chromeStorageBackupData.networks?.length) {
            console.log(
              'recovering networks from Chrome Storage',
              chromeStorageBackupData.networks
            );
            await recoverNetworks(
              chromeStorageBackupData.networks?.map((network) => network.data)
            );
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

async function getBalances(provider: Provider, address: string) {
  const { balances } = await provider.getBalances(address);
  return balances;
}
