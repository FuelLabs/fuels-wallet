import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import { getButtonByText, getByAriaLabel, hasText, visit } from '../commons';
import { mockData, WALLET_PASSWORD } from '../mocks';

test.describe('RevealPassphrase', () => {
  let browser: Browser;
  let page: Page;
  let mnemonic: string;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
    const mock = await mockData(page);
    mnemonic = mock.mnemonic;
  });

  test('should reveal passphrase', async () => {
    await visit(page, '/settings/reveal-passphrase');
    // ensure that the page has changed
    await hasText(page, /Reveal Passphrase/i);
    // fills form data
    await getByAriaLabel(page, 'Current Password').type(WALLET_PASSWORD);
    // submit data
    await getButtonByText(page, 'Reveal secret phrase').click();
    // should get here and contain data
    await hasText(page, 'Your private Secret Recovery Phrase');

    // passphrase should be visible and match the one we used to create the wallet
    mnemonic.split(' ').forEach(async (word) => {
      await hasText(page, word);
    });
  });
});
