import type { Browser, Page } from '@playwright/test';
import test, { chromium, expect } from '@playwright/test';

import {
  getButtonByText,
  getByAriaLabel,
  getElementByText,
  hasText,
  visit,
} from '../commons';
import { logout } from '../commons/logout';
import { WALLET_PASSWORD } from '../mocks';

const WORDS_12 =
  'iron hammer spoon shield ahead long banana foam deposit laundry promote captain';
const WORDS_13 =
  'belt old pulp zero toe turkey icon ancient exit blush iron hedgehog pact';
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
    await hasText(page, '0x1d23...E8E2');
  });

  test.describe('when pasting', () => {
    test('should be able to auto-select a 24-word mnemonic', async () => {
      await visit(page, '/wallet');
      await logout(page);
      await getElementByText(page, /Import seed phrase/i).click();

      /** Accept terms and conditions */
      await hasText(page, /Terms of use Agreement/i);
      const agreeCheckbox = getByAriaLabel(page, 'Agree with terms');
      await agreeCheckbox.click();
      await getButtonByText(page, /Next: Seed Phrase/i).click();

      /** Select the wrong mnemonic size */
      const format = await getByAriaLabel(page, 'Select format');
      await format.selectOption('I have a 12 words Seed Phrase');

      /** Copy words to clipboard area */
      await page.evaluate(`navigator.clipboard.writeText('${WORDS_24}')`);

      /** Simulating clipboard write */
      await getButtonByText(page, /Paste/i).click();

      /** Confirm the auto-selected mnemonic size */
      expect(format).toHaveValue('24');

      /** Confirm Mnemonic */
      const words = WORDS_24.split(' ');
      const inputs = await page.locator('input').all();
      words.forEach((word, i) => {
        expect(inputs[i]).toHaveValue(word);
      });

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
      await hasText(page, '0x73da...a71b');
    });

    test('should be able to auto-select a 15-word mnemonic if pasting only 13-words', async () => {
      await visit(page, '/wallet');
      await logout(page);
      await getElementByText(page, /Import seed phrase/i).click();

      /** Accept terms and conditions */
      await hasText(page, /Terms of use Agreement/i);
      const agreeCheckbox = getByAriaLabel(page, 'Agree with terms');
      await agreeCheckbox.click();
      await getButtonByText(page, /Next: Seed Phrase/i).click();

      /** Select the wrong mnemonic size */
      const format = await getByAriaLabel(page, 'Select format');
      await format.selectOption('I have a 12 words Seed Phrase');

      /** Copy words to clipboard area */
      await page.evaluate(`navigator.clipboard.writeText('${WORDS_13}')`);

      /** Simulating clipboard write */
      await getButtonByText(page, /Paste/i).click();

      /** Confirm the auto-selected mnemonic size */
      expect(format).toHaveValue('15');

      /** Confirm Mnemonic */
      const words = WORDS_13.split(' ');
      const inputs = await page.locator('input').all();
      words.forEach((word, i) => {
        expect(inputs[i]).toHaveValue(word);
      });
    });
  });

  test('should be able to recover a wallet from 24-word mnemonic', async () => {
    await visit(page, '/wallet');
    await getElementByText(page, /Import seed phrase/i).click();

    /** Accept terms */
    await hasText(page, /Terms of use Agreement/i);
    const agreeCheckbox = getByAriaLabel(page, 'Agree with terms');
    await agreeCheckbox.click();
    await getButtonByText(page, /Next: Seed Phrase/i).click();

    /** Select the mnemonic size */
    const format = await getByAriaLabel(page, 'Select format');
    await format.selectOption('I have a 24 words Seed Phrase');

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
    await hasText(page, '0x73da...a71b');
  });
});
