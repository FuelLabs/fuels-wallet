import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import { getButtonByText, getByAriaLabel, hasText, visit } from '../commons';
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

  test('should change balance when select a new network', async () => {
    await visit(page, '/wallet');
    await getButtonByText(page, 'Faucet').click();
    await getButtonByText(page, 'Give me ETH').click();
    await hasText(page, /Ethereum/i);
    await hasText(page, /ETH.0\.5/i);

    /** Select a new network */
    await getByAriaLabel(page, 'Selected Network').click();
    await getByAriaLabel(page, 'fuel_network-item-2').click();

    await hasText(page, "You don't have any assets");
  });

  test('should open the side bar and close it', async () => {
    await visit(page, '/wallet');
    await getByAriaLabel(page, 'Menu').click();
    await hasText(page, 'Wallet');
    await hasText(page, 'Support');
    await getByAriaLabel(page, 'drawer_closeButton').click();
  });

  test('should not show user balance when user sets it to hidden', async () => {
    await visit(page, '/wallet');
    await hasText(page, /ETH.0\.0/i);
    await getByAriaLabel(page, 'Hide balance').click(); // click on the hide balance
    await hasText(page, /ETH.•••••/i); // should hide balance
    await page.reload(); // reload the page
    await hasText(page, /ETH.•••••/i); // should not show balance
    await getByAriaLabel(page, 'Show balance').click();
    await hasText(page, /ETH.0\.0/i);
    await page.reload(); // reload the page
    await hasText(page, /ETH.0\.0/i);
  });
});
