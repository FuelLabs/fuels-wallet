import type { Browser, Page } from '@playwright/test';
import test, { expect, chromium } from '@playwright/test';

import { getButtonByText, getByAriaLabel, hasText } from '../commons';
import { mockData, WALLET_PASSWORD } from '../mocks';

test.describe('ViewRecoveryPhrase', () => {
  let browser: Browser;
  let page: Page;
  let mnemonic: string;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
    const mock = await mockData(page);
    mnemonic = mock.mnemonic;
  });

  test('should view recovery phrase', async () => {
    test.step('should show unlock screen', async () => {
      await getByAriaLabel(page, 'Menu').click();
      await page.getByText(/View Recovery Phrase/i).click();

      // Should show unlock screen
      await hasText(page, /Confirm your Password/i);
      await getByAriaLabel(page, 'Your Password').type(WALLET_PASSWORD);
      await getButtonByText(page, 'Unlock wallet').click();
    });

    test.step('should show the seed phrase', async () => {
      // Should show unlock screen
      await hasText(page, /Recovery Phrase/i);
      await getButtonByText(page, 'Copy button').click();
      const clipboardValue = await navigator.clipboard.readText();
      expect(clipboardValue).toEqual(mnemonic);
    });

    test.step('should close the page', async () => {
      await getButtonByText(page, 'Close').click();
      await hasText(page, /assets/i);
    });
  });
});
