import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import { getButtonByText, getByAriaLabel, hasText, visit } from '../commons';
import { mockData } from '../mocks';

test.describe('HomeWallet', () => {
  let browser: Browser;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
    await visit(page, '/');
    await mockData(page);
  });

  test('should change the user password', async () => {
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
    // Copies the seed phrase
    await getByAriaLabel(page, 'Copy button').click();
    const seedPhrase = await page.evaluate(async () =>
      navigator.clipboard.readText()
    );
    expect(seedPhrase.length).toBeGreaterThan(0);
  });
});
