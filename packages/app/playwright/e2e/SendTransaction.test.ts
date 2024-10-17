import type { Account } from '@fuel-wallet/types';
import type { Browser, Page } from '@playwright/test';
import test, { chromium, expect } from '@playwright/test';
import {
  type Bech32Address,
  Provider,
  Wallet,
  bn,
  fromBech32,
  toB256,
} from 'fuels';

import {
  getButtonByText,
  getByAriaLabel,
  getInputByName,
  hasText,
  visit,
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
    await getInputByName(page, 'address').fill(
      receiverWallet.address.toString()
    );

    await getInputByName(page, 'amount').focus();

    await page.waitForTimeout(1000);

    // Fill amount
    await getInputByName(page, 'amount').fill('0.001');

    // Submit transaction
    await getButtonByText(page, 'Review').click();

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
    await getInputByName(page, 'address').fill(account.address.toString());

    // Focus on input and wait, to avoid flakiness
    await getInputByName(page, 'amount').focus();
    await page.waitForTimeout(500);

    // Fill amount
    await getInputByName(page, 'amount').fill('0.001');

    // Submit transaction
    await getButtonByText(page, 'Review').click();

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
    await getInputByName(page, 'address').fill(
      receiverWallet.address.toString()
    );

    // Focus on input and wait, to avoid flakiness
    await getInputByName(page, 'amount').focus();
    await page.waitForTimeout(500);

    // Fill amount
    await getInputByName(page, 'amount').fill('0.01');

    // Check the balance is correct formated with only 2 decimals
    await hasText(page, 'Balance: 1,000,000.000');

    // Submit transaction
    await getButtonByText(page, 'Review').click();

    // Approve transaction
    await hasText(page, `0.01 ${ALT_ASSET.symbol}`);
    await getButtonByText(page, 'Approve').click();

    // Wait for transaction to be confirmed
    await hasText(page, 'success');
  });

  test('Send transaction with regular fee', async () => {
    const receiverWallet = Wallet.generate({
      provider,
    });
    await visit(page, '/send');
    await page.waitForSelector('[aria-disabled="true"]');
    await getButtonByText(page, 'Select one asset').click();
    await page.getByText('Ethereum').click();
    await getInputByName(page, 'address').fill(
      receiverWallet.address.toString()
    );

    // Focus on input and wait, to avoid flakiness
    await getInputByName(page, 'amount').focus();
    await page.waitForTimeout(500);

    await getInputByName(page, 'amount').fill('0.001');

    // Waiting button change to Review in order to ensure that fee amount is updated
    await page.waitForSelector('button:has-text("Review")');
    await page.waitForTimeout(1000);

    await getButtonByText(page, 'Review').click();

    await hasText(page, '0.001 ETH');

    await getButtonByText(page, 'Approve').click();
    await hasText(page, '0.001 ETH');

    // Wait for transaction to be confirmed
    await hasText(page, 'success');
  });

  test('Send transaction with fast fee', async () => {
    const receiverWallet = Wallet.generate({
      provider,
    });
    await visit(page, '/send');
    await page.waitForSelector('[aria-disabled="true"]');
    await getButtonByText(page, 'Select one asset').click();
    await page.getByText('Ethereum').click();
    await getInputByName(page, 'address').fill(
      receiverWallet.address.toString()
    );

    // Focus on input and wait, to avoid flakiness
    await getInputByName(page, 'amount').focus();
    await page.waitForTimeout(500);

    await getInputByName(page, 'amount').fill('0.001');

    //Selecting and extracting fast fee amount
    const fastFeeComponent = getByAriaLabel(page, 'fee value:Fast');
    await fastFeeComponent.click();

    // Waiting button change to Review in order to change fee amount
    await page.waitForSelector('button:has-text("Review")');
    await page.waitForTimeout(1000);

    await getButtonByText(page, 'Review').click();

    await hasText(page, '0.001 ETH');

    await getButtonByText(page, 'Approve').click();
    await hasText(page, '0.001 ETH');

    // Wait for transaction to be confirmed
    await hasText(page, 'success');
  });

  test('Send transaction starting with regular and changing to fast fee', async () => {
    const receiverWallet = Wallet.generate({
      provider,
    });
    await visit(page, '/send');
    await page.waitForSelector('[aria-disabled="true"]');
    await getButtonByText(page, 'Select one asset').click();
    await page.getByText('Ethereum').click();
    await getInputByName(page, 'address').fill(
      receiverWallet.address.toString()
    );

    // Focus on input and wait, to avoid flakiness
    await getInputByName(page, 'amount').focus();
    await page.waitForTimeout(500);

    await getInputByName(page, 'amount').fill('0.001');

    // Waiting button change to Review in order to ensure that fee amount is updated
    await page.waitForSelector('button:has-text("Review")');
    await page.waitForTimeout(1000);

    // Selecting and extracting regular fee amount
    const regularFeeComponent = getByAriaLabel(page, 'fee value:Regular');
    await regularFeeComponent.click();

    // Waiting button change to Review in order to ensure that fee amount is updated
    await page.waitForSelector('button:has-text("Review")');
    await page.waitForTimeout(1000);

    await getButtonByText(page, 'Review').click();

    // Waiting button change to Approve in order to get updated fee amount
    await page.waitForSelector('button:has-text("Approve")');
    await page.waitForTimeout(1000);

    // Going back to select other fee value
    await getButtonByText(page, 'Back').click();

    // Selecting and extracting fast fee amount
    const fastFeeComponent = getByAriaLabel(page, 'fee value:Fast');
    await fastFeeComponent.click();

    // Waiting button change to Review in order to change fee amount
    await page.waitForSelector('button:has-text("Review")');
    await page.waitForTimeout(1000);

    await getButtonByText(page, 'Review').click();

    // Waiting button change to Approve in order to get updated fee amount
    await page.waitForSelector('button:has-text("Approve")');
    await page.waitForTimeout(1000);

    await hasText(page, '0.001 ETH');

    await page.waitForTimeout(1000);
    await getButtonByText(page, 'Approve').click();
    await hasText(page, '0.001 ETH');

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
    await getInputByName(page, 'address').fill(
      receiverWallet.address.toString()
    );

    // Focus on input and wait, to avoid flakiness
    await getInputByName(page, 'amount').focus();
    await page.waitForTimeout(500);

    // Fill amount
    await getByAriaLabel(page, 'Max').click();

    // Get calculated fee
    await hasText(page, /(.*)ETH/);

    // Fee values change
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const maxAmountAfterFee = await getInputByName(page, 'amount').inputValue();

    // Submit transaction
    await getButtonByText(page, 'Review').click();

    // Approve transaction
    await hasText(page, `${maxAmountAfterFee} ETH`);
    await getButtonByText(page, 'Approve').click();
    await hasText(page, `${maxAmountAfterFee} ETH`);

    // Wait for transaction to be confirmed
    await hasText(page, 'success');
  });
});
