import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import { getByAriaLabel, getButtonByText, visit, hasText } from '../commons';
import { logout } from '../commons/logout';
import { WALLET_PASSWORD } from '../mocks';

const WORDS_12 =
  'iron hammer spoon shield ahead long banana foam deposit laundry promote captain';
const WORDS_24 =
  'trick modify monster anger volcano thrive jealous lens warm program milk flavor bike torch fish eye aspect cable loan little bachelor town office sound';

test.describe('RecoverWallet', () => {
  let browser: Browser;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  test('should be able to recover a wallet from 24-word mnemonic', async () => {
    await visit(page, '/wallet');

    await getButtonByText(page, /I already have a wallet/i).click();

    /** Accept terms and conditions */
    await hasText(page, /Terms of service/i);
    await getButtonByText(page, /I accept/i).click();

    /** Adding password */
    await hasText(page, /Encrypt your wallet/i);
    const passwordInput = await getByAriaLabel(page, 'Your Password');
    await passwordInput.type(WALLET_PASSWORD);
    await passwordInput.press('Tab');
    const confirmPasswordInput = await getByAriaLabel(page, 'Confirm Password');
    await confirmPasswordInput.type(WALLET_PASSWORD);
    await confirmPasswordInput.press('Tab');

    await getButtonByText(page, /Next/i).click();

    /** Copy words to clipboard area */
    await page.evaluate(`navigator.clipboard.writeText('${WORDS_24}')`);

    /** Simulating clipboard write */
    await getButtonByText(page, /Paste/i).click();

    /** Confirm Mnemonic */
    await hasText(page, /Enter your Recovery Phrase/i);
    await getButtonByText(page, /Paste/i).click();
    await getButtonByText(page, /Next/i).click();

    /** Account created */
    await hasText(page, /Wallet created successfully/i, 0, 3000000);
    await hasText(page, /Account 1/i);
    await hasText(page, 'fuel1w...4rtl');
  });

  test('should be able to recover a wallet from 12-word mnemonic', async () => {
    await visit(page, '/wallet');
    await logout(page);

    await getButtonByText(page, /I already have a wallet/i).click();

    /** Accept terms and conditions */
    await hasText(page, /Terms of service/i);
    await getButtonByText(page, /I accept/i).click();

    /** Adding password */
    await hasText(page, /Encrypt your wallet/i);
    const passwordInput = await getByAriaLabel(page, 'Your Password');
    await passwordInput.type(WALLET_PASSWORD);
    await passwordInput.press('Tab');
    const confirmPasswordInput = await getByAriaLabel(page, 'Confirm Password');
    await confirmPasswordInput.type(WALLET_PASSWORD);
    await confirmPasswordInput.press('Tab');

    await getButtonByText(page, /Next/i).click();

    // select seed phrase format
    await getByAriaLabel(page, 'Select format').selectOption(
      'I have a 12 words seed phrase'
    );

    /** Copy words to clipboard area */
    await page.evaluate(`navigator.clipboard.writeText('${WORDS_12}')`);

    /** Simulating clipboard write */
    await getButtonByText(page, /Paste/i).click();

    /** Confirm Mnemonic */
    await hasText(page, /Enter your Recovery Phrase/i);
    await getButtonByText(page, /Paste/i).click();
    await getButtonByText(page, /Next/i).click();

    /** Account created */
    await hasText(page, /Wallet created successfully/i, 0, 3000000);
    await hasText(page, /Account 1/i);
    await hasText(page, 'fuel1r...xqqj');
  });
});
