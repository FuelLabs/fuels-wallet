import type { Browser, BrowserContext, Page } from '@playwright/test';
import test, { chromium, expect } from '@playwright/test';

import { visit, getByAriaLabel, hasText, reload } from '../commons';
import { modifyGraphqlOperationStatus } from '../commons/request';
import { WALLET_PASSWORD, mockData } from '../mocks';

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

  test('should log errors getting an error when trying to fetch balance', async () => {
    // return 500 when trying to fetch balance
    const mockedPage = await modifyGraphqlOperationStatus(
      page,
      500,
      'getBalances'
    );
    await visit(mockedPage, '/wallet');
    // wait until wallet has tried to fetch balances
    await hasText(page, "You don't have any assets");

    // get errors from indexedDB
    const errors = await mockedPage.evaluate(async () => {
      const fuelDB = window.fuelDB;
      const errors = await fuelDB.errors.toArray();
      return errors;
    });
    expect(errors.length).toBeGreaterThan(0);
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
