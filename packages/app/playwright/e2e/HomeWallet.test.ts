import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import {
  getButtonByText,
  getByAriaLabel,
  hasText,
  reload,
  visit,
} from '../commons';
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

  test('should open the side bar and close it', async () => {
    await visit(page, '/wallet');
    await getByAriaLabel(page, 'Menu').click();
    await hasText(page, 'Settings');
    await hasText(page, 'Support');
    await getByAriaLabel(page, 'drawer_closeButton').click();
  });

  test('should not show user balance when user sets it to hidden', async () => {
    await visit(page, '/wallet');
    await hasText(page, /ETH.+0\.0/i);
    await getByAriaLabel(page, 'Hide balance').click(); // click on the hide balance
    await hasText(page, /ETH.+•••••/i); // should hide balance
    await reload(page); // reload the page
    await hasText(page, /ETH.+•••••/i); // should not show balance
    await getByAriaLabel(page, 'Show balance').click();
    await hasText(page, /ETH.+0\.0/i);
    await reload(page); // reload the page
    await hasText(page, /ETH.+0\.0/i);
  });
});
