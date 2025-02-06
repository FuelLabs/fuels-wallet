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
import { calculateAssetId, getBaseAssetId } from '../../src/utils';
import { testSetup, transferMaxBalance } from '../utils';

import { EXTERNAL_CONTRACT_ID } from './config';
import { test, useLocalCRX } from './test';
import { connect, waitSuccessTransaction } from './utils';

useLocalCRX();

test.describe('Forward Half ETH and Mint External Custom Asset', () => {
  let fuelWalletTestHelper: FuelWalletTestHelper;
  let fuelWallet: WalletUnlocked;
  let masterWallet: WalletUnlocked;

  const depositAmount = '0.010';
  const halfDepositAmount = '0.005';

  test.beforeEach(async ({ context, extensionId, page }) => {
    ({ fuelWalletTestHelper, fuelWallet, masterWallet } = await testSetup({
      context,
      page,
      extensionId,
      amountToFund: bn.parseUnits(depositAmount).mul(2),
    }));
  });

  test.afterEach(async () => {
    await transferMaxBalance({
      fromWallet: fuelWallet,
      toWallet: masterWallet,
    });
  });

  test('e2e forward half eth and mint external custom asset', async ({
    page,
  }) => {
    await connect(page, fuelWalletTestHelper);

    const depositHalfInput = page.getByLabel('Forward amount external mint');
    await depositHalfInput.fill(depositAmount);

    const mintAmount = '12345';
    const formattedMintAmount = '12,345';
    const mintInput = page.getByLabel('Mint amount external mint');
    await mintInput.fill(mintAmount);

    const forwardHalfAndMintButton = getButtonByText(
      page,
      'Forward Half And External Mint'
    );
    await expectButtonToBeEnabled(forwardHalfAndMintButton);
    await page.waitForTimeout(1000); // Wait for slow VM
    await forwardHalfAndMintButton.click();
    await page.waitForTimeout(1000); // Wait for slow VM

    const walletNotificationPage =
      await fuelWalletTestHelper.getWalletPopupPage();

    // test forward eth amount is correct
    await hasText(walletNotificationPage, `${depositAmount} ETH`);

    // test return eth amount is correct
    await hasText(walletNotificationPage, `${halfDepositAmount} ETH`);

    // test mint asset name is shown
    await hasText(walletNotificationPage, 'Unknown', 0, 5000, true);
    // test mint asset id is shown
    const assetId = calculateAssetId(
      EXTERNAL_CONTRACT_ID,
      await getBaseAssetId()
    );
    // await hasText(walletNotificationPage, shortAddress(assetId));
    // test mint amount is correct
    await hasText(walletNotificationPage, `${formattedMintAmount} Unknown`);

    // test gas fee is shown and correct
    await hasText(walletNotificationPage, 'Fee (network)');

    // Test approve
    const preDepositBalanceEth = await fuelWallet.getBalance();
    const preDepositBalanceTkn = await fuelWallet.getBalance(assetId);
    await fuelWalletTestHelper.walletApprove();
    await waitSuccessTransaction(page);
    const postDepositBalanceEth = await fuelWallet.getBalance();
    const postDepositBalanceTkn = await fuelWallet.getBalance(assetId);
    expect(
      Number.parseFloat(
        preDepositBalanceEth.sub(postDepositBalanceEth).format({ precision: 3 })
      )
    ).toBe(Number.parseFloat(halfDepositAmount));
    expect(
      postDepositBalanceTkn
        .sub(preDepositBalanceTkn)
        .mul(10)
        .format({ units: 1, precision: 0 })
    ).toBe(formattedMintAmount);
  });
});
