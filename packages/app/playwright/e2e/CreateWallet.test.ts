import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import {
  getButtonByText,
  getByAriaLabel,
  hasAriaLabel,
  hasText,
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
    await getButtonByText(page, /Create a Wallet/i).click();

    /** Copy Mnemonic */
    await getButtonByText(page, /Copy/i).click();
    await page.getByRole('checkbox').click();
    await getButtonByText(page, /Next/i).click();

    /** Confirm Mnemonic */
    await hasText(page, /Write down your Recovery Phrase/i);
    await getButtonByText(page, /Paste/i).click();
    await getButtonByText(page, /Next/i).click();

    /** Adding password */
    await hasText(page, /Create your password/i);
    await hasAriaLabel(page, 'Your Password');
    await hasAriaLabel(page, 'Confirm Password');
    const passwordInput = await getByAriaLabel(page, 'Your Password');
    await passwordInput.click();
    await passwordInput.type(WALLET_PASSWORD);
    await passwordInput.blur();
    await passwordInput.click();

    const confirmPasswordInput = await getByAriaLabel(page, 'Confirm Password');
    await confirmPasswordInput.click({ position: { x: 270, y: 10 } });
    await confirmPasswordInput.type(WALLET_PASSWORD);
    await confirmPasswordInput.blur();
    await page.getByRole('checkbox').click();
    await getButtonByText(page, /Next/i).click();

    /** Account created */
    await hasText(page, /Wallet created successfully/i);
    await hasText(page, /Account 1/i);
    await page.reload();
    await visit(page, '/wallet');
    await hasText(page, /assets/i, 1);
  });
});
