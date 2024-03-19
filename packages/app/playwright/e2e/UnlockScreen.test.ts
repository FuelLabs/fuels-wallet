import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import { getByAriaLabel, hasText, reload, visit } from '../commons';
import { WALLET_PASSWORD, mockData } from '../mocks';

test.describe('UnlockScreen', () => {
  let browser: Browser;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
    await visit(page, '/');
    await mockData(page);
  });

  test('UnLock and Lock wallet screen', async () => {
    await getByAriaLabel(page, 'Menu').click();
    await page.getByText(/Lock Wallet/i).click();
    await hasText(page, 'Unlock your wallet to continue');
    await reload(page);
    await hasText(page, 'Unlock your wallet to continue');
    await getByAriaLabel(page, 'Your Password').fill(WALLET_PASSWORD);
    await getByAriaLabel(page, 'Unlock wallet').click();
    await hasText(page, /assets/i);
    await reload(page);
    await hasText(page, /assets/i);
  });

  test('UnLock and Lock wallet screen without reload page', async () => {
    await getByAriaLabel(page, 'Menu').click();
    await page.getByText(/Lock Wallet/i).click();
    await hasText(page, 'Unlock your wallet to continue');
    await getByAriaLabel(page, 'Your Password').fill(WALLET_PASSWORD);
    await getByAriaLabel(page, 'Unlock wallet').click();
    await hasText(page, /assets/i);
  });

  test('Reset password on wallet', async () => {
    // Lock wallet first
    await getByAriaLabel(page, 'Menu').click();
    await page.getByText(/Lock Wallet/i).click();
    await hasText(page, 'Unlock your wallet to continue');

    await page.getByText('Forgot password?').click();
    await hasText(page, /Reset wallet/i);
    await getByAriaLabel(page, 'Confirm Reset').click();
    await getByAriaLabel(page, 'Reset wallet').click();
    await hasText(page, /Create new wallet/i);
  });
});
