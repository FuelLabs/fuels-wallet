import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import {
  getByAriaLabel,
  hasAriaLabel,
  hasText,
  reload,
  visit,
  waitUrl,
} from '../commons';
import type { MockData } from '../mocks';
import { mockData } from '../mocks';

test.describe('SelectWallet', () => {
  let browser: Browser;
  let page: Page;
  let data: MockData;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  test.beforeEach(async () => {
    await visit(page, '/');
    data = await mockData(page, 2);
    await reload(page);
  });

  test('should be able to switch between accounts', async () => {
    await visit(page, '/wallet');
    await getByAriaLabel(page, 'Accounts').click();
    await hasText(page, data.accounts[0].name);
    await hasText(page, data.accounts[1].name);
    await getByAriaLabel(page, data.accounts[1].name).click();
    await waitUrl(page, '/wallet');
    const address = data.accounts[1].address.toString();
    await hasAriaLabel(page, address);
  });
});
