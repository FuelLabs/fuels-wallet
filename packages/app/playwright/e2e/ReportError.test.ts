import type { Browser, BrowserContext, Page } from '@playwright/test';
import test, { chromium, expect } from '@playwright/test';

import { visit, hasText, getButtonByText } from '../commons';
import { mockData } from '../mocks';

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
      const errors = (await fuelDB?.errors?.toArray()) ?? [];
      return errors;
    });
  }

  test('should show Error page when there is a js error in React', async () => {
    await visit(page, '/');
    await page.evaluate(() => {
      window.testCrash();
    });

    await hasText(page, /Fuel Wallet has detected unreported errors/i);

    // get errors from indexedDB
    const errors = await getPageErrors(page);
    expect(errors.length).toBeGreaterThan(0);

    // report error
    await getButtonByText(page, 'Send to Fuel').click();

    await page.waitForTimeout(1000);

    const errorsAfterReporting = await getPageErrors(page);
    expect(errorsAfterReporting.length).toBe(0);
  });
});
