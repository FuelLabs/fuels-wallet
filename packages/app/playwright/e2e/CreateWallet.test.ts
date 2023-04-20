import type { Browser, Locator, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import {
  getButtonByText,
  getByAriaLabel,
  hasText,
  reload,
  visit,
  waitUrl,
} from '../commons';
import { WALLET_PASSWORD } from '../mocks';

test.describe('CreateWallet', () => {
  let browser: Browser;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  test('should be redirected to /signup by default', async () => {
    await visit(page, '/');
    await waitUrl(page, '/sign-up');
  });

  test('should be able to create wallet and see first account created', async () => {
    await visit(page, '/wallet');
    await reload(page);
    await getButtonByText(page, /Create a Wallet/i).click();

    /** Adding password */
    await hasText(page, /Encrypt your wallet/i);
    const passwordInput = getByAriaLabel(page, 'Your Password');
    await passwordInput.type(WALLET_PASSWORD);
    await passwordInput.press('Tab');
    const confirmPasswordInput = getByAriaLabel(page, 'Confirm Password');
    await confirmPasswordInput.type(WALLET_PASSWORD);
    await confirmPasswordInput.press('Tab');
    await getButtonByText(page, /Next/i).click();

    /** Copy Mnemonic */
    await hasText(page, /Backup your Recovery Phrase/i);
    // get all the recovery words from the input fields
    const recoveryWordsEl = page.locator('span[data-idx]');
    const recoveryWords = await recoveryWordsEl.allInnerTexts();
    const savedCheckbox = getByAriaLabel(page, 'Confirm Saved');
    await savedCheckbox.click();
    await getButtonByText(page, /Next/i).click();

    /** Confirm Mnemonic */
    await hasText(page, /Confirm your Recovery Phrase/i);
    // get all empty text fields
    const allInputs: Locator[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const input of await page.locator('input').all()) {
      await allInputs.push(input);
    }

    // check if they are empty
    await Promise.all([
      ...allInputs.map(async (input, index) => {
        // eslint-disable-next-line no-promise-executor-return
        await new Promise((resolve) => setTimeout(resolve, index * 300));
        const text = await input.inputValue();
        if (text.length < 1) {
          const word = recoveryWords[index];
          await input.type(word);
        }
      }),
    ]);

    await getButtonByText(page, /Next/i).click();

    /** Account created */
    await hasText(page, /Wallet created successfully/i);
    await hasText(page, /Account 1/i);
    await visit(page, '/wallet');
    await hasText(page, /assets/i, 1);
  });
});
