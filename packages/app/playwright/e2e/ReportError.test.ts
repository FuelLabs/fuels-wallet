import type { Browser, BrowserContext, Page } from '@playwright/test';
import test, { chromium, expect } from '@playwright/test';

import {
  visit,
  getByAriaLabel,
  hasText,
  getButtonByText,
  getInputByName,
  reload,
} from '../commons';
import { DEFAULT_NETWORKS, WALLET_PASSWORD, mockData } from '../mocks';

test.describe('ReportError', () => {
  let browser: Browser;
  let page: Page;
  let browserContext: BrowserContext;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    browserContext = await browser.newContext();
    page = await browserContext.newPage();
    await mockData(page);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function getPageErrors(page: Page): Promise<any> {
    return page.evaluate(async () => {
      const fuelDB = window.fuelDB;
      const errors = await fuelDB.errors.toArray();
      return errors;
    });
  }

  test('should log errors after trying to add network twice', async () => {
    await visit(page, '/wallet');
    await getByAriaLabel(page, 'Selected Network').click();
    await hasText(page, 'Local');
    await hasText(page, 'Another');

    await hasText(page, /Add new network/i);
    await getByAriaLabel(page, 'Add network').click();
    const buttonCreate = await getButtonByText(page, /add/i);
    await expect(buttonCreate).toBeDisabled();
    const urlInput = await getInputByName(page, 'url');
    await expect(urlInput).toBeFocused();
    await urlInput.fill(DEFAULT_NETWORKS[0].url);
    await page.waitForTimeout(3500); // Wait to fetch `chainInfo`
    await hasText(page, /Local/i);
    await expect(buttonCreate).toBeEnabled();
    await buttonCreate.click();
    // page should display error
    await hasText(page, /This network Name or URL already exist/i);
    // get errors from indexedDB
    const errors = await page.evaluate(async () => {
      const fuelDB = window.fuelDB;
      const errors = await fuelDB.errors.toArray();
      return errors;
    });
    await expect(errors[0].message).toContain(
      'This network Name or URL already exist'
    );
  });

  test('should show report error dialog when there is an error', async () => {
    await reload(page);
    const errors = await getPageErrors(page);
    // check if the password page is displayed
    const hasPasswordInput = await getByAriaLabel(
      page,
      'Your Password'
    ).count();
    if (hasPasswordInput > 0) {
      await getByAriaLabel(page, 'Your Password').type(WALLET_PASSWORD);
      await getByAriaLabel(page, 'Unlock wallet').click();
    }
    if (errors.length > 0) {
      // if there are errors, the report error dialog should be displayed
      await hasText(page, /Help us improve Fuel Wallet/i);
      await getByAriaLabel(page, 'Report Error Once').click();
      await page.waitForTimeout(3500);
      // since we cannot test test mailto link handler, we'll just check if the errors were cleard
      const errors = await getPageErrors(page);
      await expect(errors.length).toBe(0);
    }
  });
});
