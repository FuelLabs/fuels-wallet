import { encrypt } from '@fuel-ts/keystore';
import { Mnemonic } from '@fuel-ts/mnemonic';
import type { Account as WalletAccount } from '@fuel-ts/wallet-manager';
import { WalletManager } from '@fuel-ts/wallet-manager';
import type { Account, Network } from '@fuel-wallet/types';
import type { Page } from '@playwright/test';

import { getByAriaLabel } from '../commons/locator';
import { hasText } from '../commons/text';
import { reload, visit } from '../commons/visit';

const { VITE_FUEL_PROVIDER_URL } = process.env;

export const WALLET_PASSWORD = 'Qwe1234567$';
export const PRIVATE_KEY =
  '0xa449b1ffee0e2205fa924c6740cc48b3b473aa28587df6dab12abc245d1f5291';

const DEFAULT_NETWORKS: Array<Network> = [
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

export const CUSTOM_ASSET = {
  assetId: '0x566012155ae253353c7df01f36c8f6249c94131a69a3484bdb0234e3822b5d90',
  name: 'New',
  symbol: 'NEW',
  imageUrl:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
  isCustom: true,
};

export const CUSTOM_ASSET_2 = {
  assetId: '0x566012155ae253353c7df01f36c8f6249c94131a69a3484bdb0234e3822b5d91',
  name: 'New1',
  symbol: 'NEW1',
  imageUrl:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
  isCustom: true,
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
      const acounnt = await createAccount(walletAccount, index);
      return acounnt;
    })
  );
}

type SerializedVault = {
  key: string;
  data: string;
};

export async function serializeVault(
  manager: WalletManager
): Promise<SerializedVault> {
  const vaultKey = manager.STORAGE_KEY;
  const vaultData = await manager.exportVault(0);
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
  networks: Array<Network> = DEFAULT_NETWORKS
) {
  await visit(page, '/');
  const mnemonic = Mnemonic.generate(16);
  const manager = await createManager(mnemonic);
  const accounts = await createAccounts(manager, numberOfAccounts);
  const vault = await serializeVault(manager);

  await page.evaluate(
    ([accounts, networks, vault, password]: [
      Array<Account>,
      Array<Network>,
      SerializedVault,
      string
    ]) => {
      return new Promise((resolve, reject) => {
        (async function main() {
          try {
            const fuelDB = window.fuelDB;
            await fuelDB.vaults.clear();
            await fuelDB.vaults.add(vault);
            await fuelDB.accounts.clear();
            await fuelDB.accounts.bulkAdd(accounts);
            await fuelDB.networks.clear();
            await fuelDB.networks.bulkAdd(networks);
            resolve(await fuelDB.networks.toArray());
          } catch (err: unknown) {
            reject(err);
          }
          localStorage.setItem('fuel_isLogged', JSON.stringify(true));
          localStorage.setItem('password', password);
        })();
      });
    },
    [accounts, networks, vault, WALLET_PASSWORD]
  );
  await reload(page);

  return {
    mnemonic,
    manager,
    accounts,
    networks,
  };
}

export async function unlock(page, password = WALLET_PASSWORD) {
  await reload(page);
  try {
    await hasText(page, 'Welcome back');
    await getByAriaLabel(page, 'Your Password').type(password);
    await getByAriaLabel(page, 'Unlock wallet').click();
  } catch (err) {
    // Ignore
  }
}

export type MockData = Awaited<ReturnType<typeof mockData>>;
