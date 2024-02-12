// Use a test fixture to set the context so tests have access to the wallet extension.
import { test as base, chromium, type BrowserContext } from '@playwright/test';

import { downloadFuel } from './downloadFuel';

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
  pathToExtension: string;
  fuelWalletVersion: string;
}>({
  fuelWalletVersion: '0.15.1',
  pathToExtension: async ({ fuelWalletVersion }, use) => {
    const fuelPath = await downloadFuel(fuelWalletVersion);
    await use(fuelPath);
  },
  context: async ({ pathToExtension }, use) => {
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background) background = await context.waitForEvent('serviceworker');

    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});

export const expect = test.expect;
