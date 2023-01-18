import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import { getButtonByText, hasText, reload, visit } from '../commons';
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
    await reload(page);
  });

  test('Should logout and redirect to create new wallet', async () => {
    await visit(page, '/accounts/logout');
    await hasText(page, 'Logout');
    await getButtonByText(page, 'Logout').click();
    await hasText(page, 'Create a new Fuel Wallet');
  });
});
