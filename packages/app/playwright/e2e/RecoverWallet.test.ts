import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import {
  getByAriaLabel,
  getButtonByText,
  visit,
  hasText,
  hasAriaLabel,
} from '../commons';
import { WALLET_PASSWORD } from '../mocks';

const WORDS =
  'iron hammer spoon shield ahead long banana foam deposit laundry promote captain';

test.describe('RecoverWallet', () => {
  let browser: Browser;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  test('should be able to recover a wallet', async () => {
    await visit(page, '/wallet');
    await getButtonByText(page, /I already have a wallet/i).click();

    /** Copy words to clipboard area */
    await page.evaluate(`navigator.clipboard.writeText('${WORDS}')`);

    /** Simulating clipboard write */
    await getButtonByText(page, /Paste/i).click();

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
    await hasText(page, 'fuel1r...xqqj');
  });
});
