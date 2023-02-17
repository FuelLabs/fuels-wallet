import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import { getButtonByText, getByAriaLabel, hasText, visit } from '../commons';
import { mockData } from '../mocks';

test.describe('Logout', () => {
  let browser: Browser;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  test.beforeEach(async () => {
    await visit(page, '/');
    await mockData(page, 2);
  });

  test('Should logout and redirect to create new wallet', async () => {
    await getByAriaLabel(page, 'Menu').click();
    await page.locator(`[data-key="settings"]`).click();
    await page.locator(`[data-key="logout"]`).click();
    await getButtonByText(page, /Logout/).click();
    await hasText(page, 'Create a new Fuel Wallet');
  });
});
