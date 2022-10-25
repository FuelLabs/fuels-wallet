import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';
import { fetch } from 'cross-fetch';

import {
  getButtonByText,
  getByAriaLabel,
  hasText,
  visit,
  waitUrl,
} from '../commons';

const { E2E_PORT = 9000 } = process.env;

test.describe('CreateWallet', () => {
  let browser: Browser;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
    console.log('fetch provider', E2E_PORT);
    await fetch(`http://localhost:${E2E_PORT}/wallet`)
      .then((data) => data.text())
      .then((data) => {
        console.log('return', data);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  test('should be redirect to /signup by default', async () => {
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
    await page.reload();
    await visit(page, '/wallet');
    await hasText(page, /assets/i);
  });
});
