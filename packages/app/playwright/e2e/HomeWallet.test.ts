import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import { getByAriaLabel, hasText, visit } from '../commons';
import { seedCurretAccount } from '../commons/seedWallet';
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
    await seedCurretAccount(page, 5_000_000);
    await hasText(page, /Ethereum/i);
    await hasText(page, /0,5 ETH/i);

    /** Select a new network */
    await getByAriaLabel(page, 'Selected Network').click();
    await getByAriaLabel(page, 'fuel_network-item-1').click();

    await hasText(page, /you don't have any assets/i);
  });

  test('should open the side bar and close it', async () => {
    await visit(page, '/wallet');
    await getByAriaLabel(page, 'Menu').click();
    await hasText(page, 'Wallet');
    await hasText(page, 'Support');
    await getByAriaLabel(page, 'drawer_closeButton').click();
  });
});
