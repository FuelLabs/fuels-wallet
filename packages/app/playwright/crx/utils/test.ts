// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import path from 'path';
import type { BrowserContext } from '@playwright/test';
import { test as base, chromium } from '@playwright/test';
import { delay } from '../../commons';

const pathToExtension = path.join(__dirname, '../../../dist-crx');

export const test = base.extend<{
  extensionId: string;
}>({
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background) background = await context.waitForEvent('serviceworker');

    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});

let context: BrowserContext;

test.beforeAll(async () => {
  console.log('pathToExtension', pathToExtension);
  await delay(5000);
  console.log('after delay');
  context = await chromium.launchPersistentContext('', {
    headless: false,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
    ],
  });
  console.log('ok?');
});

test.afterAll(({ context }) => {
  context.close();
});

test.use({
  // biome-ignore lint/correctness/noEmptyPattern: <explanation>
  context: ({}, use) => {
    use(context);
  },
});
