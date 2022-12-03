/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Page } from '@playwright/test';
import { Wallet } from 'fuels';

const { VITE_FUEL_PROVIDER_URL } = process.env;

export async function getAccount(page: Page) {
  return page.evaluate(async () => {
    // @ts-ignore;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fuelDB: any = window.fuelDB;
    const accounts = await fuelDB.accounts.toArray();
    return accounts[0];
  });
}

export async function mockData(page: Page) {
  const wallet = Wallet.generate({ provider: VITE_FUEL_PROVIDER_URL });
  await page.evaluate(
    ([accountData, providerUrl]) => {
      return new Promise((resolve, reject) => {
        (async function main() {
          try {
            // @ts-ignore;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fuelDB: any = window.fuelDB;
            await fuelDB.accounts.clear();
            await fuelDB.accounts.add(accountData);
            await fuelDB.networks.clear();
            await fuelDB.networks.add({
              id: '1',
              isSelected: true,
              name: 'Local',
              url: providerUrl,
            });
            await fuelDB.networks.add({
              id: '2',
              isSelected: false,
              name: 'Another',
              url: 'https://another.network.fuel/graphql',
            });
            const networks = await fuelDB.networks.toArray();
            resolve(networks);
          } catch (err: unknown) {
            reject(err);
          }
          localStorage.setItem('fuel__isLogged', 'true');
        })();
      });
    },
    [
      {
        address: wallet.address.toAddress(),
        balance: '0',
        balanceSymbol: 'ETH',
        balances: [],
        name: 'Random Account',
        publicKey: wallet.publicKey,
      },
      VITE_FUEL_PROVIDER_URL,
    ]
  );
}
