import type { Account } from '@fuel-wallet/types';
import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';
import { bn, Provider, Wallet } from 'fuels';

import {
  getButtonByText,
  hasText,
  visit,
  getInputByName,
  getByAriaLabel,
  hasAriaLabel,
} from '../commons';
import { seedWallet } from '../commons/seedWallet';
import { ALT_ASSET, mockData } from '../mocks';

test.describe('SendTransaction', () => {
  let browser: Browser;
  let page: Page;
  let account: Account;
  let provider: Provider;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
    await visit(page, '/');
    const { accounts } = await mockData(page);
    account = accounts[0];
    await seedWallet(account.address, bn(100_000_000));
    provider = await Provider.create(process.env.VITE_FUEL_PROVIDER_URL);
  });

  test('Send transaction', async () => {
    const receiverWallet = Wallet.generate({
      provider,
    });
    await visit(page, '/send');

    // Check submit button is disable by default
    await page.waitForSelector('[aria-disabled="true"]');

    // Select asset
    await getButtonByText(page, 'Select one asset').click();
    await page.getByText('Ethereum').click();

    // Fill address
    await getInputByName(page, 'address').type(
      receiverWallet.address.toString(),
    );

    // Fill amount
    await getInputByName(page, 'amount').type('0.001');

    // Submit transaction
    await getButtonByText(page, 'Confirm').click();

    await getButtonByText(page, 'Approve').click();
    await hasText(page, '0.001 ETH');

    // Wait for transaction to be confirmed
    await hasText(page, 'success');
  });

  test('Send transaction same owner', async () => {
    await visit(page, '/send');

    // Check submit button is disable by default
    await page.waitForSelector('[aria-disabled="true"]');

    // Select asset
    await getButtonByText(page, 'Select one asset').click();
    await page.getByText('Ethereum').click();

    // Fill address
    await getInputByName(page, 'address').type(account.address.toString());

    // Fill amount
    await getInputByName(page, 'amount').type('0.001');

    // Submit transaction
    await getButtonByText(page, 'Confirm').click();

    // Approve transaction
    await hasText(page, '0.001 ETH');
    await getButtonByText(page, 'Approve').click();

    // Wait for transaction to be confirmed
    await hasText(page, 'success');
  });

  test('Send transaction in other Asset', async () => {
    const receiverWallet = Wallet.generate({
      provider,
    });
    await visit(page, '/send');

    // Check submit button is disable by default
    await page.waitForSelector('[aria-disabled="true"]');

    // Select asset
    await getButtonByText(page, 'Select one asset').click();
    await page.getByText(ALT_ASSET.name).click();

    // Fill address
    await getInputByName(page, 'address').type(
      receiverWallet.address.toString(),
    );

    // Fill amount
    await getInputByName(page, 'amount').type('0.01');
    // Check the balance is correct formated with only 2 decimals
    await hasAriaLabel(page, 'Balance: 1,000,000.00');

    // Submit transaction
    await getButtonByText(page, 'Confirm').click();

    // Approve transaction
    await hasText(page, `0.01 ${ALT_ASSET.symbol}`);
    await getButtonByText(page, 'Approve').click();

    // Wait for transaction to be confirmed
    await hasText(page, 'success');
  });

  test('Send max amount transaction', async () => {
    const receiverWallet = Wallet.generate({
      provider,
    });
    await visit(page, '/send');

    // Check submit button is disable by default
    await page.waitForSelector('[aria-disabled="true"]');

    // Select asset
    await getButtonByText(page, 'Select one asset').click();
    await page.getByText('Ethereum').click();

    // Fill address
    await getInputByName(page, 'address').type(
      receiverWallet.address.toString(),
    );

    // Fill amount
    await getByAriaLabel(page, 'Max').click();
    const value = await getInputByName(page, 'amount').inputValue();

    // Submit transaction
    await getButtonByText(page, 'Confirm').click();

    // Approve transaction
    await hasText(page, `${value} ETH`);
    await getButtonByText(page, 'Approve').click();

    // Wait for transaction to be confirmed
    await hasText(page, 'success');
  });
});
