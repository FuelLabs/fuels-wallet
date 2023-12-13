import type { Browser, Page } from '@playwright/test';
import test, { chromium, expect } from '@playwright/test';

import {
  getByAriaLabel,
  getButtonByText,
  visit,
  hasText,
  getElementByText,
} from '../commons';
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

  test('should be able to recover a wallet', async () => {
    await visit(page, '/wallet');
    await getElementByText(page, /Import seed phrase/i).click();

    /** Accept terms */
    await hasText(page, /Terms of use Agreement/i);
    const agreeCheckbox = getByAriaLabel(page, 'Agree with terms');
    await agreeCheckbox.click();
    await getButtonByText(page, /Next: Seed Phrase/i).click();

    /** Copy words to clipboard area */
    await page.evaluate(`navigator.clipboard.writeText('${WORDS_12}')`);

    /** Simulating clipboard write */
    await getButtonByText(page, /Paste/i).click();

    /** Confirm Mnemonic */
    await hasText(page, /Recover wallet/i);
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
    await hasText(page, 'fuel1r...xqqj');
  });

  test('should auto-select right mnemonic format and recover wallet', async () => {
    await visit(page, '/wallet');
    await logout(page);
    await getButtonByText(page, /I already have a wallet/i).click();

    /** Accept terms and conditions */
    await hasText(page, /Terms of service/i);
    await getButtonByText(page, /I accept/i).click();

    /** Select the wrong mnemonic size */
    await getByAriaLabel(page, 'Select format').selectOption(
      'I have a 12 words Seed Phrase'
    );

    /** Copy words to clipboard area */
    await page.evaluate(`navigator.clipboard.writeText('${WORDS_24}')`);

    /** Simulating clipboard write */
    await getButtonByText(page, /Paste/i).click();

    /** Confirm Mnemonic */
    WORDS_24.split(' ').map((word) =>
      expect(page.getByText(word)).toBeDefined()
    );
    await hasText(page, /Enter seed phrase/i);
    await getButtonByText(page, /Paste/i).click();
    await getButtonByText(page, /Next/i).click();

    /** Adding password */
    await hasText(page, /Create password for encryption/i);
    const passwordInput = await getByAriaLabel(page, 'Your Password');
    await passwordInput.type(WALLET_PASSWORD);
    await passwordInput.press('Tab');
    const confirmPasswordInput = await getByAriaLabel(page, 'Confirm Password');
    await confirmPasswordInput.type(WALLET_PASSWORD);
    await confirmPasswordInput.press('Tab');

    await getButtonByText(page, /Next/i).click();

    /** Account created */
    await hasText(page, /Wallet created successfully/i);
    await hasText(page, /Account 1/i);
    await hasText(page, 'fuel1w...4rtl');
  });

  test('should be able to recover a wallet from 24-word mnemonic', async () => {
    await visit(page, '/wallet');
    await logout(page);
    await getElementByText(page, /Import seed phrase/i).click();

    /** Accept terms */
    await hasText(page, /Terms of use Agreement/i);
    const agreeCheckbox = getByAriaLabel(page, 'Agree with terms');
    await agreeCheckbox.click();
    await getButtonByText(page, /Next: Seed Phrase/i).click();

    await getByAriaLabel(page, 'Select format').selectOption(
      'I have a 24 words Seed Phrase'
    );

    /** Copy words to clipboard area */
    await page.evaluate(`navigator.clipboard.writeText('${WORDS_24}')`);

    /** Simulating clipboard write */
    await getButtonByText(page, /Paste/i).click();

    /** Confirm Mnemonic */
    await hasText(page, /Recover wallet/i);
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
    await hasText(page, 'fuel1w...4rtl');
  });
});
