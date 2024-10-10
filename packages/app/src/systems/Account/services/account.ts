import { createProvider } from '@fuel-wallet/connections';
import type {
  Account,
  AccountBalance,
  AccountWithBalance,
  CoinAsset,
} from '@fuel-wallet/types';
import { Address, type Provider, bn } from 'fuels';
import { AssetService } from '~/systems/Asset/services';
import { getFuelAssetByAssetId } from '~/systems/Asset/utils';
import type { Maybe } from '~/systems/Core/types';
import { db } from '~/systems/Core/utils/database';
import { getUniqueString } from '~/systems/Core/utils/string';

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
      return db.accounts.get({ address });
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

      const assets = await AssetService.getAssets();
      // includes "asset" prop in balance, centralizing the complexity here instead of in rest of UI
      const nextBalancesWithAssets = await balances.reduce(
        async (acc, balance) => {
          const prev = await acc;
          const asset = await getFuelAssetByAssetId({
            assets,
            assetId: balance.assetId,
          });
          return [
            ...prev,
            {
              ...balance,
              amount: balance.amount,
              asset,
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
    // biome-ignore lint/complexity/noThisInStatic: <explanation>
    const exitsAccountWithName = this.filterByName(accounts, name).length > 0;
    return exitsAccountWithName;
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
}

// ----------------------------------------------------------------------------
// Private methods
// ----------------------------------------------------------------------------

async function getBalances(provider: Provider, publicKey = '0x00') {
  const address = Address.fromPublicKey(publicKey);
  const { balances } = await provider.getBalances(address);
  return balances;
}
