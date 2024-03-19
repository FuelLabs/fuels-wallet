import type { Browser, Page } from '@playwright/test';
import test, { expect, chromium } from '@playwright/test';

import {
  getButtonByText,
  getByAriaLabel,
  getElementByText,
  hasText,
} from '../commons';
import { WALLET_PASSWORD, mockData } from '../mocks';

test.describe('ViewSeedPhrase', () => {
  let browser: Browser;
  let page: Page;
  let mnemonic: string;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
    const mock = await mockData(page);
    mnemonic = mock.mnemonic;
  });

  test('should view seed phrase', async () => {
    await test.step('should show unlock screen', async () => {
      await getByAriaLabel(page, 'Menu').click();
      await getElementByText(page, /Settings/i).click();
      await page.getByText(/View Seed Phrase/i).click();

      // Should show unlock screen
      await hasText(page, /Confirm your Password/i);
      await getByAriaLabel(page, 'Your Password').fill(WALLET_PASSWORD);
      await getButtonByText(page, 'Unlock').click();
    });

    await test.step('should show the seed phrase', async () => {
      // Should show unlock screen
      await hasText(page, /Seed Phrase/i);
      await getByAriaLabel(page, 'Copy seed phrase').click();
      const clipboardValue = await page.evaluate(() =>
        navigator.clipboard.readText()
      );
      await expect(clipboardValue).toEqual(mnemonic);
    });

    await test.step('should close the page', async () => {
      await getByAriaLabel(page, 'Close dialog').click();
      await hasText(page, /assets/i);
    });
  });
});
