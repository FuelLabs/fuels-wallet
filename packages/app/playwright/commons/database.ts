/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Page } from '@playwright/test';
import { Wallet } from 'fuels';

const { VITE_FUEL_PROVIDER_URL } = process.env;

export async function injectIndexedDB(page: Page) {
  const wallet = Wallet.generate({
    provider: VITE_FUEL_PROVIDER_URL,
  });
  await page.evaluate(
    ([accountData, providerUrl]) => {
      return new Promise((resolve, reject) => {
        (async function main() {
          const script = document.createElement('script');
          // Inject Dexie to manage database on the same way we
          // do on the application level
          script.src = 'https://unpkg.com/dexie/dist/dexie.js';
          script.onload = async () => {
            try {
              // @ts-ignore
              const database = new Dexie('FuelDB');
              database.version(6).stores({
                vaults: `key`,
                accounts: `address`,
                networks: `&id, &url, &name`,
                applications: 'origin',
                transactions: `&id`,
              });
              await database.accounts.clear();
              await database.accounts.add(accountData);
              await database.networks.clear();
              await database.networks.add({
                id: '1',
                isSelected: true,
                name: 'Local',
                url: providerUrl,
              });
              await database.networks.add({
                id: '2',
                isSelected: false,
                name: 'Another',
                url: 'https://another.network.fuel/graphql',
              });
              resolve(true);
            } catch (err: unknown) {
              reject(err);
            }
          };
          document.body.append(script);
          // Mock localStorage
          localStorage.setItem('fuel__isLogged', 'true');
        })();
      });
    },
    [
      {
        address: wallet.address.toAddress(),
        name: 'Random Account',
        publicKey: wallet.publicKey,
      },
      VITE_FUEL_PROVIDER_URL,
    ]
  );
  await page.reload();
}
