import type { Account } from '@fuel-wallet/types';
import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';
import { bn, Wallet } from 'fuels';

import { getButtonByText, hasText, visit, getInputByName } from '../commons';
import { seedWallet } from '../commons/seedWallet';
import { mockData } from '../mocks';

test.describe('SendTransaction', () => {
  let browser: Browser;
  let page: Page;
  let account: Account;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
    await visit(page, '/');
    const { accounts } = await mockData(page);
    account = accounts[0];
    await seedWallet(account.address, bn(100_000_000));
  });

  test('Send transaction', async () => {
    const receiverWallet = Wallet.generate({
      provider: process.env.VITE_FUEL_PROVIDER_URL,
    });
    await visit(page, '/send');

    // Check submit button is disable by default
    await page.waitForSelector('[aria-disabled="true"]');

    // Select asset
    await getButtonByText(page, 'Select one asset').click();
    await page.getByText('Ethereum').click();

    // Fill address
    await getInputByName(page, 'address').type(
      receiverWallet.address.toString()
    );

    // Fill amount
    await getInputByName(page, 'amount').type('0.001');

    // Check submit button is enabled after filling all fields
    await page.waitForSelector('[aria-disabled="false"]');

    // Submit transaction
    await getButtonByText(page, 'Confirm').click();

    await getButtonByText(page, 'Approve').click();
    await hasText(page, '0.001 ETH');

    // Wait for transaction to be confirmed
    await hasText(page, 'Success');
  });
});
