import type { Account } from '@fuel-wallet/types';
import type { Browser, Page } from '@playwright/test';
import test, { chromium, expect } from '@playwright/test';
import { Provider, Wallet, bn } from 'fuels';

import {
  getButtonByText,
  getByAriaLabel,
  getInputByName,
  hasAriaLabel,
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
    await hasAriaLabel(page, 'Balance: 1,000,000.00');

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
    await getInputByName(page, 'address').fill(receiverWallet.address.toB256());

    // Focus on input and wait, to avoid flakiness
    await getInputByName(page, 'amount').focus();
    await page.waitForTimeout(500);

    await getInputByName(page, 'amount').fill('0.001');

    // Waiting button change to Review in order to ensure that fee amount is updated
    await page.waitForSelector('button:has-text("Review")');
    await page.waitForTimeout(1000);

    // Selecting and extracting regular fee amount
    const regularFeeComponent = getByAriaLabel(page, 'fee value:Regular');
    const regularFeeAmount = (await regularFeeComponent.textContent())
      .replace(' ETH', '')
      .trim();

    await getButtonByText(page, 'Review').click();

    // Extract and compare the network fee amount, checking if its equal to regular fee amont
    const networkFeeComponentWithRegular = getByAriaLabel(
      page,
      'fee value:Network'
    ).first();
    const networkFeeAmountWithRegular = (
      await networkFeeComponentWithRegular.textContent()
    )
      .replace(' ETH', '')
      .trim();
    // Validating the amount
    expect(regularFeeAmount).toBe(networkFeeAmountWithRegular);

    await hasText(page, /(.*)ETH/);

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
    await getInputByName(page, 'address').fill(receiverWallet.address.toB256());

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

    const fastFeeAmount = (await fastFeeComponent.textContent())
      .replace(' ETH', '')
      .trim();

    await getButtonByText(page, 'Review').click();

    // Extract and compere the network fee amount, checking if its equal to fast fee amount
    const networkFeeComponentWithFast = getByAriaLabel(
      page,
      'fee value:Network'
    ).first();
    const networkFeeAmountWithFast = (
      await networkFeeComponentWithFast.textContent()
    )
      .replace(' ETH', '')
      .trim();
    // Validating the amount
    expect(fastFeeAmount).toBe(networkFeeAmountWithFast);

    await hasText(page, /(.*)ETH/);

    await getButtonByText(page, 'Approve').click();
    await hasText(page, '0.001 ETH');

    // Wait for transaction to be confirmed
    await hasText(page, 'success');
  });

  test.only('Send transaction starting with regular and changing to fast fee', async () => {
    const receiverWallet = Wallet.generate({
      provider,
    });
    await visit(page, '/send');
    await page.waitForSelector('[aria-disabled="true"]');
    await getButtonByText(page, 'Select one asset').click();
    await page.getByText('Ethereum').click();
    await getInputByName(page, 'address').fill(receiverWallet.address.toB256());

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
    const regularFeeAmount = (await regularFeeComponent.textContent())
      .replace(' ETH', '')
      .trim();
    await getButtonByText(page, 'Review').click();

    // Waiting button change to Approve in order to get updated fee amount
    await page.waitForSelector('button:has-text("Approve")');
    await page.waitForTimeout(1000);

    // Extract and compare the network fee amount, checking if its equal to regular fee amont
    const networkFeeComponentWithRegular = getByAriaLabel(
      page,
      'fee value:Network'
    ).first();
    const networkFeeAmountWithRegular = (
      await networkFeeComponentWithRegular.textContent()
    )
      .replace(' ETH', '')
      .trim();

    // Validating the amount
    expect(regularFeeAmount).toBe(networkFeeAmountWithRegular);

    // Going back to select other fee value
    await getButtonByText(page, 'Back').click();

    // Selecting and extracting fast fee amount
    const fastFeeComponent = getByAriaLabel(page, 'fee value:Fast');
    await fastFeeComponent.click();

    // Waiting button change to Review in order to change fee amount
    await page.waitForSelector('button:has-text("Review")');
    await page.waitForTimeout(1000);

    const fastFeeAmount = (await fastFeeComponent.textContent())
      .replace(' ETH', '')
      .trim();

    await page.waitForTimeout(1000);
    await getButtonByText(page, 'Review').click();

    // Waiting button change to Approve in order to get updated fee amount
    await page.waitForSelector('button:has-text("Approve")');
    await page.waitForTimeout(1000);

    // Extract and compere the network fee amount, checking if its equal to fast fee amount
    const networkFeeComponentWithFast = getByAriaLabel(
      page,
      'fee value:Network'
    ).first();
    const networkFeeAmountWithFast = (
      await networkFeeComponentWithFast.textContent()
    )
      .replace(' ETH', '')
      .trim();

    // Validating the amount
    expect(fastFeeAmount).toBe(networkFeeAmountWithFast);

    await hasText(page, /(.*)ETH/);

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
    const maxAmount = await getInputByName(page, 'amount').inputValue();

    // Get calculated fee
    await hasText(page, /(.*)ETH/);
    const regularFee = await getByAriaLabel(page, 'fee value:Regular').first();
    const feeAmountText = (await regularFee.textContent())
      .replace(' ETH', '')
      .trim();
    const feeAmount = bn.parseUnits(feeAmountText);

    // Max amount after calculating fee
    const maxAmountAfterFee = await getInputByName(page, 'amount').inputValue();
    const totalAmount = feeAmount.add(bn.parseUnits(maxAmountAfterFee));
    await expect(bn.parseUnits(maxAmount).toString()).toBe(
      totalAmount.toString()
    );

    // Submit transaction
    await getButtonByText(page, 'Review').click();

    // Approve transaction
    await hasText(page, `${maxAmountAfterFee} ETH`);
    await getButtonByText(page, 'Approve').click();

    // Wait for transaction to be confirmed
    await hasText(page, 'success');
  });
});
