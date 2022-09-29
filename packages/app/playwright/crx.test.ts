import { expect } from '@playwright/test';

import { test } from './utils';

test.describe('CRX FuelWallet', () => {
  test('On install sign-up page is open', async ({ context }) => {
    const page = await context.waitForEvent('page', {
      predicate: (page) => page.url().includes('sign-up'),
    });
    await expect(page.url()).toContain('sign-up');
    await page.close();
  });

  test('If user opens popup it should force open a sign-up page', async ({
    context,
    extensionId,
  }) => {
    const popupPage = await context.newPage();
    await popupPage.goto(`chrome-extension://${extensionId}/popup.html`);
    const page = await context.waitForEvent('page', {
      predicate: (page) => page.url().includes('sign-up'),
    });
    await expect(page.url()).toContain('sign-up');
  });
});
