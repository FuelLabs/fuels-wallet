import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import { visit } from '../commons';
import { logout } from '../commons/logout';
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
    await logout(page);
  });
});
