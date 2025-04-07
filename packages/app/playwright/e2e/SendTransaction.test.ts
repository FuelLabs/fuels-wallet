import type { Account } from '@fuel-wallet/types';
import { expectButtonToBeEnabled } from '@fuels/playwright-utils';
import type { Browser, Page } from '@playwright/test';
import test, { chromium, expect } from '@playwright/test';
import { Provider, Wallet, bn } from 'fuels';

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
    provider = new Provider(process.env.VITE_FUEL_PROVIDER_URL);
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

    const btnLocator = getButtonByText(page, 'Review');

    await expectButtonToBeEnabled(btnLocator);
    await btnLocator.click();

    await getButtonByText(page, 'Submit').click();
    await hasText(page, '0.001 ETH');

    // Wait for transaction to be confirmed
    await hasText(page, 'Success');
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
    // make sure the button is enabled
    const btnLocator = getButtonByText(page, 'Review');

    await expectButtonToBeEnabled(btnLocator);
    await btnLocator.click();

    // Approve transaction
    await hasText(page, '0.001 ETH');
    await getButtonByText(page, 'Submit').click();

    // Wait for transaction to be confirmed
    await hasText(page, 'Success');
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

    const btnLocator = getButtonByText(page, 'Review');

    await expectButtonToBeEnabled(btnLocator);
    await btnLocator.click();

    // Approve transaction
    await hasText(page, `0.01 ${ALT_ASSET.symbol}`);
    await getButtonByText(page, 'Submit').click();

    // Wait for transaction to be confirmed
    await hasText(page, 'Success');
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

    const btnLocator = getButtonByText(page, 'Review');

    await expectButtonToBeEnabled(btnLocator);
    await btnLocator.click();

    await hasText(page, '0.001 ETH');

    await getButtonByText(page, 'Submit').click();
    await hasText(page, '0.001 ETH');

    // Wait for transaction to be confirmed
    await hasText(page, 'Success');
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
    const fastFeeComponent = getByAriaLabel(page, 'Fast');
    await fastFeeComponent.click();

    // Waiting button change to Review in order to change fee amount
    await page.waitForSelector('button:has-text("Review")');

    const btnLocator = getButtonByText(page, 'Review');

    await expectButtonToBeEnabled(btnLocator);
    await btnLocator.click();

    await hasText(page, '0.001 ETH');

    await getButtonByText(page, 'Submit').click();
    await hasText(page, '0.001 ETH');

    // Wait for transaction to be confirmed
    await hasText(page, 'Success');
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

    // Selecting and extracting regular fee amount
    await expect
      .poll(
        async () => {
          return await getByAriaLabel(page, 'Regular').isVisible();
        },
        { timeout: 10000 }
      )
      .toBeTruthy();
    const regularFeeComponent = getByAriaLabel(page, 'Regular');
    await regularFeeComponent.click();

    // Waiting button change to Review in order to ensure that fee amount is updated
    await page.waitForSelector('button:has-text("Review")');

    const btnLocatorBeforeApprv = getButtonByText(page, 'Review');

    await expectButtonToBeEnabled(btnLocatorBeforeApprv);
    await btnLocatorBeforeApprv.click();

    // Waiting button change to Approve in order to get updated fee amount
    await page.waitForSelector('button:has-text("Submit")');

    await expect
      .poll(
        async () => {
          return await getButtonByText(page, 'Back').isVisible();
        },
        { timeout: 10000 }
      )
      .toBeTruthy();
    // Going back to select other fee value
    await getButtonByText(page, 'Back').click();

    // Selecting and extracting fast fee amount
    const fastFeeComponent = getByAriaLabel(page, 'Fast');
    await fastFeeComponent.click();

    // Waiting button change to Review in order to change fee amount
    await page.waitForSelector('button:has-text("Review")');

    const btnLocator = getButtonByText(page, 'Review');

    await expectButtonToBeEnabled(btnLocator);
    await btnLocator.click();

    // Waiting button change to Approve in order to get updated fee amount
    await page.waitForSelector('button:has-text("Submit")');

    await hasText(page, '0.001 ETH');

    await expect
      .poll(
        async () => {
          return await getButtonByText(page, 'Submit').isEnabled();
        },
        { timeout: 10000 }
      )
      .toBeTruthy();
    await getButtonByText(page, 'Submit').click();
    await hasText(page, '0.001 ETH');

    // Wait for transaction to be confirmed
    await expect
      .poll(
        async () => {
          return await hasText(page, 'Success');
        },
        { timeout: 10000 }
      )
      .toBeTruthy();
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

    // Submit transaction

    const btnLocator = getButtonByText(page, 'Review');

    await expectButtonToBeEnabled(btnLocator);
    const maxAmountAfterFee = await getInputByName(page, 'amount').inputValue();
    await btnLocator.click();

    // Approve transaction
    await hasText(page, `${maxAmountAfterFee.slice(0, 5)} ETH`);
    await getButtonByText(page, 'Submit').click();
    await hasText(page, `${maxAmountAfterFee.slice(0, 5)} ETH`);

    // Wait for transaction to be confirmed
    await hasText(page, 'Success');
  });

  test('Send transaction to an asset address should fail', async () => {
    const assetAddress = await provider.getBaseAssetId();
    await visit(page, '/send');
    await getInputByName(page, 'address').fill(assetAddress);
    await getInputByName(page, 'amount').fill('0.001');
    await expect(
      page.getByText("You can't send to Asset address")
    ).toBeVisible();
  });

  test('Send transaction to a @domain', async () => {
    await visit(page, '/send');
    const domain = '@bakoid';

    // Select asset
    await getButtonByText(page, 'Select one asset').click();
    await page.getByText('Ethereum').click();

    // Fill address with domain and select it
    await getInputByName(page, 'address').fill(domain);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await page.getByText(domain).click();
    await page.waitForTimeout(1000);

    // Fill amount
    await getInputByName(page, 'amount').focus();
    await getInputByName(page, 'amount').fill('0.001');

    // Submit transaction
    const btnLocator = getButtonByText(page, 'Review');

    await expectButtonToBeEnabled(btnLocator);
    await btnLocator.click();

    await getButtonByText(page, 'Submit').click();
    await hasText(page, '0.001 ETH');

    // Wait for transaction to be confirmed
    await hasText(page, 'Success');
  });
});
