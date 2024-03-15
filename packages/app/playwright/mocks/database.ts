import type { Account as WalletAccount } from '@fuel-ts/wallet-manager';
import { WalletManager } from '@fuel-ts/wallet-manager';
import type {
  Account,
  Asset,
  AssetData,
  Connection,
  NetworkData,
} from '@fuel-wallet/sdk';
import type { Page } from '@playwright/test';
import { Mnemonic, encrypt, Address } from 'fuels';

import { getByAriaLabel } from '../commons/locator';
import { hasText } from '../commons/text';
import { reload, visit } from '../commons/visit';

const { VITE_FUEL_PROVIDER_URL } = process.env;

export const WALLET_PASSWORD = 'Qwe1234567$';
export const PRIVATE_KEY =
  '0xa449b1ffee0e2205fa924c6740cc48b3b473aa28587df6dab12abc245d1f5291';

export const DEFAULT_NETWORKS: Array<NetworkData> = [
  {
    id: '1',
    isSelected: true,
    name: 'Local',
    url: VITE_FUEL_PROVIDER_URL,
  },
  {
    id: '2',
    isSelected: false,
    name: 'Another',
    url: 'https://another.network.fuel/graphql',
  },
];

export const CUSTOM_ASSET_INPUT: Asset = {
  name: 'New',
  symbol: 'NEW',
  icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
  networks: [
    {
      type: 'fuel',
      assetId:
        '0x566012155ae253353c7df01f36c8f6249c94131a69a3484bdb0234e3822b5d90',
      decimals: 2,
      chainId: 0,
    },
  ],
};
export const CUSTOM_ASSET_INPUT_2: Asset = {
  name: 'New1',
  symbol: 'NEW1',
  icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
  networks: [
    {
      type: 'fuel',
      assetId:
        '0x566012155ae253353c7df01f36c8f6249c94131a69a3484bdb0234e3822b5d91',
      decimals: 2,
      chainId: 0,
    },
  ],
};

export const CUSTOM_ASSET = {
  assetId: '0x566012155ae253353c7df01f36c8f6249c94131a69a3484bdb0234e3822b5d90',
  name: 'New',
  symbol: 'NEW',
  imageUrl:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
  isCustom: true,
  decimals: 2,
};

export const CUSTOM_ASSET_2 = {
  assetId: '0x566012155ae253353c7df01f36c8f6249c94131a69a3484bdb0234e3822b5d91',
  name: 'New1',
  symbol: 'NEW1',
  imageUrl:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
  isCustom: true,
  decimals: 2,
};

export const ALT_ASSET = {
  assetId: '0x0000000000000000000000000000000000000000000000000000000000000001',
  name: 'Alt Token',
  symbol: 'ALT',
  imageUrl:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
  isCustom: true,
  decimals: 2,
};

export const FUEL_NETWORK = {
  name: 'Fuel Testnet',
  url: 'https://beta-5.fuel.network/graphql',
};

export async function getAccount(page: Page) {
  return page.evaluate(async () => {
    const fuelDB = window.fuelDB;
    const accounts = await fuelDB.accounts.toArray();
    return accounts[0];
  });
}

export async function createManager(mnemonic: string) {
  const walletManager = new WalletManager();
  // Unlock manager
  await walletManager.unlock(WALLET_PASSWORD);
  await walletManager.addVault({
    type: 'mnemonic',
    secret: mnemonic,
    provider: null,
  });

  return walletManager;
}

export function createAccount(wallet: WalletAccount, index: number = 0) {
  return {
    address: wallet.address.toAddress(),
    balance: '0',
    balanceSymbol: 'ETH',
    balances: [],
    name: `Account ${index}`,
    publicKey: wallet.publicKey,
    isHidden: false,
    isCurrent: index === 0,
  };
}

export function createAccounts(
  manager: WalletManager,
  numberOfAccounts: number = 1
) {
  return Promise.all(
    new Array(numberOfAccounts).fill(0).map(async (_, index) => {
      const walletAccount = await manager.addAccount();
      const account = createAccount(walletAccount, index);
      return account;
    })
  );
}

export function createConnections(accounts: Array<string>): Connection[] {
  const numberOfConnections = 1;
  return new Array(numberOfConnections).fill(0).map(() => {
    return {
      origin: 'http://localhost:3004',
      title: 'mock connection',
      favIconUrl: '',
      accounts,
    };
  });
}

type SerializedVault = {
  key: string;
  data: string;
};

export async function serializeVault(
  manager: WalletManager
): Promise<SerializedVault> {
  const vaultKey = manager.STORAGE_KEY;
  const vaultData = manager.exportVault(0);
  const encryptedData = await encrypt(WALLET_PASSWORD, {
    vaults: [
      {
        type: 'mnemonic',
        data: vaultData,
      },
    ],
  });

  return { key: vaultKey, data: JSON.stringify(encryptedData) };
}

export async function mockData(
  page: Page,
  numberOfAccounts: number = 1,
  networks: Array<NetworkData> = DEFAULT_NETWORKS
) {
  await visit(page, '/');
  const mnemonic = Mnemonic.generate(16);
  const manager = await createManager(mnemonic);
  const accounts = await createAccounts(manager, numberOfAccounts);
  const vault = await serializeVault(manager);
  const connections = createConnections(
    accounts.map((account) => account.address)
  );

  await page.evaluate(
    ([accounts, networks, connections, assets, vault, password]: [
      Array<Account>,
      Array<NetworkData>,
      Array<Connection>,
      Array<AssetData>,
      SerializedVault,
      string,
    ]) => {
      return new Promise((resolve, reject) => {
        (async function main() {
          try {
            const fuelDB = window.fuelDB;
            await fuelDB.errors.clear();
            await fuelDB.vaults.clear();
            await fuelDB.vaults.add(vault);
            await fuelDB.accounts.clear();
            await fuelDB.accounts.bulkAdd(accounts);
            await fuelDB.networks.clear();
            await fuelDB.networks.bulkAdd(networks);
            await fuelDB.connections.clear();
            await fuelDB.connections.bulkAdd(connections);
            await fuelDB.assets.bulkAdd(assets);
            resolve(await fuelDB.networks.toArray());
          } catch (err: unknown) {
            reject(err);
          }
          localStorage.setItem('fuel_isLogged', JSON.stringify(true));
          localStorage.setItem('password', password);
        })();
      });
    },
    [accounts, networks, connections, [ALT_ASSET], vault, WALLET_PASSWORD]
  );
  await reload(page);

  const accountsWithPkey = accounts.map((acc) => ({
    ...acc,
    privateKey: manager.exportPrivateKey(Address.fromString(acc.address)),
  }));

  return {
    mnemonic,
    manager,
    accounts: accountsWithPkey,
    networks,
    connections,
  };
}

export async function unlock(page, password = WALLET_PASSWORD) {
  await reload(page);
  try {
    await hasText(page, 'Welcome back');
    await getByAriaLabel(page, 'Your Password').fill(password);
    await getByAriaLabel(page, 'Unlock wallet').click();
  } catch (err) {
    // Ignore
  }
}

export type MockData = Awaited<ReturnType<typeof mockData>>;
