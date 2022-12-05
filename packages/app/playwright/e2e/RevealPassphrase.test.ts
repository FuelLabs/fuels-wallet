import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import { getButtonByText, getByAriaLabel, hasText, visit } from '../commons';

const WORDS =
  'iron hammer spoon shield ahead long banana foam deposit laundry promote captain';

test.describe('HomeWallet', () => {
  let browser: Browser;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  test('should change the user password', async () => {
    await visit(page, '/wallet');
    await getButtonByText(page, /I already have a wallet/i).click();

    /** Copy words to clipboard area */
    await page.evaluate(`navigator.clipboard.writeText('${WORDS}')`);

    /** Simulating clipboard write */
    await getButtonByText(page, /Paste/i).click();

    /** Confirm Mnemonic */
    await hasText(page, /Write down your Recover Phrase/i);
    await getButtonByText(page, /Paste/i).click();
    await getButtonByText(page, /Next/i).click();

    /** Adding password */
    await hasText(page, /Create your password/i);
    await getByAriaLabel(page, 'Your Password').type('12345678');
    await getByAriaLabel(page, 'Confirm Password').type('12345678');
    await page.getByRole('checkbox').click();
    await getButtonByText(page, /Next/i).click();

    /** Account created */
    await hasText(page, /Wallet created successfully/i);
    await hasText(page, /Account 1/i);
    await hasText(page, 'fuel1r...xqqj');

    // goes to the change password page
    await visit(page, '/settings/reveal-passphrase');
    // ensure that the page has changed
    await hasText(page, /Reveal Passphrase/i);
    // fills form data
    await getByAriaLabel(page, 'Current Password').type('12345678');
    // submit data
    await getButtonByText(page, 'Reveal secret phrase').click();
    // should get here and contain data
    await hasText(page, 'Your private Secret Recovery Phrase');

    // passphrase should be visible and match the one we used to create the wallet
    WORDS.split(' ').forEach(async (word) => {
      await hasText(page, word);
    });
  });
});
