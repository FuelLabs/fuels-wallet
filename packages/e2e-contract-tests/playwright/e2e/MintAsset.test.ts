import type { FuelWalletTestHelper } from '@fuels/playwright-utils';
import {
  expectButtonToBeEnabled,
  getButtonByText,
  hasText,
} from '@fuels/playwright-utils';
import { expect } from '@playwright/test';
import { bn } from 'fuels';
import type { WalletUnlocked } from 'fuels';

import '../../load.envs.js';
import {
  calculateAssetId,
  getBaseAssetId,
  shortAddress,
} from '../../src/utils';
import { testSetup, transferMaxBalance } from '../utils';

import { MAIN_CONTRACT_ID } from './config';
import { test, useLocalCRX } from './test';
import {
  checkAddresses,
  checkAriaLabelsContainsText,
  connect,
  waitSuccessTransaction,
} from './utils';

useLocalCRX();

test.describe('Mint Assets', () => {
  let fuelWalletTestHelper: FuelWalletTestHelper;
  let fuelWallet: WalletUnlocked;
  let masterWallet: WalletUnlocked;

  test.beforeEach(async ({ context, extensionId, page }) => {
    ({ fuelWalletTestHelper, fuelWallet, masterWallet } = await testSetup({
      context,
      page,
      extensionId,
      amountToFund: bn.parseUnits('0.001'),
    }));
  });

  test.afterEach(async () => {
    await transferMaxBalance({
      fromWallet: fuelWallet,
      toWallet: masterWallet,
    });
  });

  test('e2e mint unknown assets', async ({ page }) => {
    await connect(page, fuelWalletTestHelper);

    const mintAmount = '12345';
    const formattedMintAmount = '12,345';
    const mintInput = page.getByLabel('Mint asset card').getByRole('textbox');
    await mintInput.fill(mintAmount);

    const mintButton = getButtonByText(page, 'Mint', true);
    await expectButtonToBeEnabled(mintButton);
    await mintButton.click();

    // test asset is correct
    const assetId = calculateAssetId(MAIN_CONTRACT_ID, await getBaseAssetId());
    const walletNotificationPage =
      await fuelWalletTestHelper.getWalletPopupPage();
    // short address function copied from app package
    await hasText(walletNotificationPage, shortAddress(assetId), 0, 10000);

    // test mint amount is correct
    await hasText(walletNotificationPage, formattedMintAmount);

    // test gas fee is shown and correct
    await hasText(walletNotificationPage, 'Fee (network)');

    await checkAddresses(
      { address: fuelWallet.address.toString(), isContract: false },
      { address: MAIN_CONTRACT_ID, isContract: true },
      walletNotificationPage
    );
    await checkAddresses(
      { address: MAIN_CONTRACT_ID, isContract: true },
      { address: fuelWallet.address.toString(), isContract: false },
      walletNotificationPage
    );

    const preMintBalanceTkn = await fuelWallet.getBalance(assetId);
    await fuelWalletTestHelper.walletApprove();
    await waitSuccessTransaction(page);
    const postMintBalanceTkn = await fuelWallet.getBalance(assetId);
    expect(
      postMintBalanceTkn
        .sub(preMintBalanceTkn)
        .mul(10)
        .format({ units: 1, precision: 0 })
    ).toBe(formattedMintAmount);
  });

  test('e2e mint known asset', async ({ page }) => {
    await connect(page, fuelWalletTestHelper);

    const subId =
      '0x0000000000000000000000000000000000000000000000000000000000000001';
    const name = 'Token';
    const symbol = 'TKN';
    const decimals = '6';
    const assetId = calculateAssetId(MAIN_CONTRACT_ID, subId);

    await fuelWalletTestHelper.addAssetThroughSettings(
      assetId,
      name,
      symbol,
      Number(decimals)
    );

    const mintAmount = '1.2345';
    const mintAmountInput = page.getByLabel('Asset config amount');
    await mintAmountInput.fill(mintAmount);

    const subIdInput = page.getByLabel('Asset config subid');
    await subIdInput.fill(subId);

    const decimalsInput = page.getByLabel('Asset config decimals');
    await decimalsInput.fill(decimals);

    const mintButton = getButtonByText(page, 'Mint Asset configuration');

    await expectButtonToBeEnabled(mintButton);
    await mintButton.click();

    // test asset is correct
    const walletNotificationPage =
      await fuelWalletTestHelper.getWalletPopupPage();

    // Test if asset name is defined (not unknown)
    checkAriaLabelsContainsText(
      walletNotificationPage,
      'Asset Name',
      'Ethereum'
    );
    // Test if sender name is defined (not unknown)
    checkAriaLabelsContainsText(walletNotificationPage, 'Sender Name', '');

    // scroll to bottom of page to ensure all text is visible
    await walletNotificationPage.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight)
    );

    await hasText(walletNotificationPage, name);
    await hasText(walletNotificationPage, shortAddress(assetId), 0, 10000);
    // test mint amount is correct
    await hasText(walletNotificationPage, `1.2345 ${symbol}`);

    // test gas fee is shown and correct
    await hasText(walletNotificationPage, 'Fee (network)');

    // test to and from addresses
    await checkAddresses(
      { address: fuelWallet.address.toString(), isContract: false },
      { address: MAIN_CONTRACT_ID, isContract: true },
      walletNotificationPage
    );
    await checkAddresses(
      { address: MAIN_CONTRACT_ID, isContract: true },
      { address: fuelWallet.address.toString(), isContract: false },
      walletNotificationPage
    );

    const preMintBalanceTkn = await fuelWallet.getBalance(assetId);
    await fuelWalletTestHelper.walletApprove();
    await waitSuccessTransaction(page);
    const postMintBalanceTkn = await fuelWallet.getBalance(assetId);
    expect(
      Number.parseFloat(
        postMintBalanceTkn
          .sub(preMintBalanceTkn)
          .format({ precision: 6, units: 6 })
      )
    ).toBe(Number.parseFloat(mintAmount));
  });
});
