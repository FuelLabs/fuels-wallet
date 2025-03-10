import type { FuelWalletTestHelper } from '@fuels/playwright-utils';
import {
  expectButtonToBeEnabled,
  getButtonByText,
  hasText,
} from '@fuels/playwright-utils';
import { expect } from '@playwright/test';
import type { WalletUnlocked } from 'fuels';
import { bn } from 'fuels';

import '../../load.envs';
import type { IdentityInput } from '../../src/contracts/contracts/CustomAssetAbi';
import { calculateAssetId, getBaseAssetId } from '../../src/utils';
import { testSetup, transferMaxBalance } from '../utils';

import { CustomAsset } from '../../src/contracts/contracts';
import { MAIN_CONTRACT_ID } from './config';
import { test, useLocalCRX } from './test';
import { connect, waitSuccessTransaction } from './utils';

useLocalCRX();
test.describe('Forward Half Custom Asset', () => {
  let fuelWallet: WalletUnlocked;
  let fuelWalletTestHelper: FuelWalletTestHelper;
  let masterWallet: WalletUnlocked;

  const forwardCustomAssetAmount = '10000';
  const formattedForwardCustomAssetAmount = '10,000';
  const formattedHalfForwardCustomAssetAmount = '5,000';

  test.beforeEach(async ({ context, extensionId, page }) => {
    ({ fuelWallet, fuelWalletTestHelper, masterWallet } = await testSetup({
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

  test('e2e forward half custom asset', async ({ page }) => {
    await connect(page, fuelWalletTestHelper);

    // Mint custom asset to wallet
    const contract = new CustomAsset(MAIN_CONTRACT_ID, fuelWallet);
    const recipient: IdentityInput = {
      Address: {
        bits: fuelWallet.address.toB256(),
      },
    };

    const assetId = calculateAssetId(MAIN_CONTRACT_ID, await getBaseAssetId());
    const { waitForResult } = await contract.functions
      .mint(recipient, await getBaseAssetId(), bn(100_000_000_000))
      .call();

    await waitForResult();

    const forwardHalfCustomAssetInput = page
      .getByLabel('Forward half custom asset card')
      .getByRole('textbox');
    await forwardHalfCustomAssetInput.fill(forwardCustomAssetAmount);

    const forwardHalfCustomAssetButton = getButtonByText(
      page,
      'Forward Half Custom Asset'
    );
    await expectButtonToBeEnabled(forwardHalfCustomAssetButton);
    await page.waitForTimeout(1000); // Wait for slow VM
    await forwardHalfCustomAssetButton.click();
    await page.waitForTimeout(1000); // Wait for slow VM

    const walletNotificationPage =
      await fuelWalletTestHelper.getWalletPopupPage();

    // test the forward asset name is shown
    await hasText(walletNotificationPage, 'Unknown', 0, 5000, true);
    // test forward custom asset amount is correct
    await hasText(
      walletNotificationPage,
      `${formattedForwardCustomAssetAmount} Unknown`
    );

    // test return asset name is shown
    await hasText(walletNotificationPage, 'Unknown', 1, 5000, true);
    // test return asset amount is correct
    await hasText(
      walletNotificationPage,
      `${formattedHalfForwardCustomAssetAmount} Unknown`
    );

    // test gas fee is correct
    await hasText(walletNotificationPage, 'Fee (network)');

    // Test approve
    const preDepositBalanceTkn = await fuelWallet.getBalance(assetId);
    await fuelWalletTestHelper.walletApprove();
    await waitSuccessTransaction(page);
    const postDepositBalanceTkn = await fuelWallet.getBalance(assetId);
    expect(
      preDepositBalanceTkn
        .sub(postDepositBalanceTkn)
        .mul(10)
        .format({ units: 1, precision: 0 })
    ).toBe(formattedHalfForwardCustomAssetAmount);
  });
});
