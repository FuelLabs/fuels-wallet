import type {
  AssetData,
  Connection,
  NetworkData,
  Account as WalletAccount,
} from '@fuel-wallet/types';
import type { Page } from '@playwright/test';
import type { Asset, AssetFuel, WalletManagerAccount } from 'fuels';
import {
  Address,
  CHAIN_IDS,
  Mnemonic,
  TESTNET_NETWORK_URL,
  WalletManager,
  encrypt,
} from 'fuels';

import { expect } from '@fuels/playwright-utils';
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
    chainId: 0,
    isSelected: true,
    name: 'Local',
    url: VITE_FUEL_PROVIDER_URL,
    faucetUrl: 'http://localhost:4040',
  },
  {
    id: '2',
    chainId: 0,
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

export const CUSTOM_ASSET_INPUT_3: Asset = {
  name: 'New2',
  symbol: 'NEW2',
  icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
  networks: [
    {
      type: 'fuel',
      assetId:
        '0x566012155ae253353c7df01f36c8f6249c94131a69a3484bdb0234e3822b5d99',
      decimals: 2,
      chainId: 0,
    },
  ],
};

export const CUSTOM_ASSET_INPUT_4: Asset = {
  name: 'New3',
  symbol: 'NEW3',
  icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
  networks: [
    {
      type: 'fuel',
      assetId:
        '0x566012155ae253353c7df01f36c8f6249c94131a69a3484bdb0234e3822b5d20',
      decimals: 2,
      chainId: 0,
    },
  ],
};

export const CUSTOM_ASSET_SCREEN = {
  assetId: '0x566012155ae253353c7df01f36c8f6249c94131a69a3484bdb0234e3822b5d92',
  name: 'New',
  symbol: 'NEW',
  icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
  isCustom: true,
  decimals: 2,
};

export const ALT_ASSET = {
  name: 'Alt Token',
  symbol: 'ALT',
  icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
  isCustom: true,
  networks: [
    {
      type: 'fuel',
      assetId:
        '0x0000000000000000000000000000000000000000000000000000000000000001',
      decimals: 2,
      chainId: 0,
    } as AssetFuel,
  ],
};

export const FUEL_LOCAL_NETWORK = {
  url: 'http://localhost:4000/v1/graphql',
  chainId: CHAIN_IDS.fuel.testnet,
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
  });

  return walletManager;
}

export function createAccount(wallet: WalletManagerAccount, index = 0) {
  return {
    address: wallet.address.toString(),
    balance: '0',
    balanceSymbol: 'ETH',
    balances: [],
    name: `Account ${index + 1}`,
    publicKey: wallet.publicKey,
    isHidden: false,
    isCurrent: index === 0,
  };
}

export function createAccounts(manager: WalletManager, numberOfAccounts = 1) {
  return Promise.all(
    new Array(numberOfAccounts).fill(0).map(async (_, index) => {
      let walletAccount = null;
      if (index === 0) {
        walletAccount = await manager.getAccounts()[0];
      } else {
        walletAccount = await manager.addAccount();
      }

      const accounts = createAccount(walletAccount, index);
      return accounts;
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
  numberOfAccounts = 1,
  networks: Array<NetworkData> = DEFAULT_NETWORKS,
  seedPhrase?: string
) {
  await visit(page, '/');
  const mnemonic = seedPhrase || Mnemonic.generate(16);
  const manager = await createManager(mnemonic);
  const accounts = await createAccounts(manager, numberOfAccounts);
  const vault = await serializeVault(manager);
  const connections = createConnections(
    accounts.map((account) => account.address)
  );

  await expect
    .poll(
      async () => {
        return await page
          .evaluate(
            async ([accounts, networks, connections, assets, vault, password]: [
              Array<WalletAccount>,
              Array<NetworkData>,
              Array<Connection>,
              Array<AssetData>,
              SerializedVault,
              string,
            ]) => {
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
              const assetsArray = await fuelDB.assets.toArray();
              if (assetsArray.length === 0) {
                await fuelDB.assets.bulkAdd(assets);
              } else {
                for (const asset of assets) {
                  if (
                    !assetsArray.find(
                      (a) => JSON.stringify(a) === JSON.stringify(asset)
                    )
                  ) {
                    await fuelDB.assets.add(asset);
                  }
                }
              }
              localStorage.setItem('fuel_isLogged', JSON.stringify(true));
              localStorage.setItem('password', password);
            },
            [
              accounts,
              networks,
              connections,
              [ALT_ASSET],
              vault,
              WALLET_PASSWORD,
            ]
          )
          .then(() => true)
          .catch(() => false);
      },
      { timeout: 15000 }
    )
    .toBeTruthy();

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
  } catch (_err) {
    // Ignore
  }
}

export type MockData = Awaited<ReturnType<typeof mockData>>;
