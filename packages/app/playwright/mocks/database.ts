/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Page } from '@playwright/test';
import { Wallet } from 'fuels';

const { VITE_FUEL_PROVIDER_URL } = process.env;

const networks = [
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

export async function getAccount(page: Page) {
  return page.evaluate(async () => {
    // @ts-ignore;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fuelDB: any = window.fuelDB;
    const accounts = await fuelDB.accounts.toArray();
    return accounts[0];
  });
}

export function createAccount(index: number = 0) {
  const wallet = Wallet.generate();
  return {
    address: wallet.address.toAddress(),
    balance: '0',
    balanceSymbol: 'ETH',
    balances: [],
    name: `Account ${index}`,
    publicKey: wallet.publicKey,
    isHidden: false,
    isSelected: index === 0,
  };
}

export function createAccounts(numberOfAccounts: number = 1) {
  return new Array(numberOfAccounts)
    .fill(0)
    .map((_, index) => createAccount(index));
}

export async function mockData(page: Page, numberOfAccounts: number = 1) {
  const accounts = createAccounts(numberOfAccounts);
  await page.evaluate(
    ([accounts, networks]) => {
      return new Promise((resolve, reject) => {
        (async function main() {
          try {
            // @ts-ignore;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fuelDB: any = window.fuelDB;
            await fuelDB.accounts.clear();
            await fuelDB.accounts.bulkAdd(accounts);
            await fuelDB.networks.clear();
            await fuelDB.networks.bulkAdd(networks);
            resolve(await fuelDB.networks.toArray());
          } catch (err: unknown) {
            reject(err);
          }
          localStorage.setItem('fuel_isLogged', JSON.stringify(true));
        })();
      });
    },
    [accounts, networks]
  );

  return {
    accounts,
    networks,
  };
}

export type MockData = Awaited<ReturnType<typeof mockData>>;
