import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import { getButtonByText, hasText, visit } from '../commons';
import { mockData } from '../mocks';

test.describe('FaucetDialog', () => {
  let browser: Browser;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
    await mockData(page);
  });

  test('should be able to faucet a wallet', async () => {
    await visit(page, '/wallet');
    await hasText(page, /Faucet/i);

    /** Needs to have Faucet button */
    await getButtonByText(page, /Faucet/i).click();

    /** Ask to start Faucet */
    await getButtonByText(page, /Give me ETH/i).click();

    /** Checks if Balance in assets list refreshed */
    await hasText(page, /Ethereum/i);
    await hasText(page, /ETH.0\.5/i);
  });
});
