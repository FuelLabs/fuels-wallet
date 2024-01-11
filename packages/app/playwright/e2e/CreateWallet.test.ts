import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import {
  getButtonByText,
  getByAriaLabel,
  getElementByText,
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
    await getElementByText(page, /Create new wallet/i).click();

    /** Accept terms */
    await hasText(page, /Terms of use Agreement/i);
    const agreeCheckbox = getByAriaLabel(page, 'Agree with terms');
    await agreeCheckbox.click();
    await getButtonByText(page, /Next: Seed Phrase/i).click();

    /** Copy Mnemonic */
    await hasText(page, /Write down seed phrase/i);
    await getButtonByText(page, /Copy/i).click();
    const savedCheckbox = getByAriaLabel(page, 'Confirm Saved');
    await savedCheckbox.click();
    await getButtonByText(page, /Next/i).click();

    /** Confirm Mnemonic */
    await hasText(page, /Confirm phrase/i);
    await getButtonByText(page, /Paste/i).click();
    await getButtonByText(page, /Next/i).click();

    /** Adding password */
    await hasText(page, /Create password for encryption/i);
    const passwordInput = getByAriaLabel(page, 'Your Password');
    await passwordInput.fill(WALLET_PASSWORD);
    await passwordInput.press('Tab');
    const confirmPasswordInput = getByAriaLabel(page, 'Confirm Password');
    await confirmPasswordInput.fill(WALLET_PASSWORD);
    await confirmPasswordInput.press('Tab');

    await getButtonByText(page, /Next/i).click();

    /** Account created */
    await hasText(page, /Wallet created successfully/i);
    await hasText(page, /Account 1/i);
    await visit(page, '/wallet');
    await hasText(page, /assets/i, 1);
  });
});
