import {
  expectButtonToBeEnabled,
  getButtonByText,
  hasText,
} from '@fuels/playwright-utils';
import type { FuelWalletTestHelper } from '@fuels/playwright-utils';
import { expect } from '@playwright/test';
import { bn } from 'fuels';
import type { WalletUnlocked } from 'fuels';

import '../../load.envs.js';
import { calculateAssetId, getBaseAssetId } from '../../src/utils';
import { testSetup, transferMaxBalance } from '../utils';

import { MAIN_CONTRACT_ID } from './config';
import { test, useLocalCRX } from './test';
import { checkAddresses, connect, waitSuccessTransaction } from './utils';

useLocalCRX();

test.describe('Forward and Mint Multicall', () => {
  let fuelWalletTestHelper: FuelWalletTestHelper;
  let fuelWallet: WalletUnlocked;
  let masterWallet: WalletUnlocked;

  const depositAmount = '0.010';

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

  test('e2e forward and mint multicall', async ({ page }) => {
    await connect(page, fuelWalletTestHelper);

    const depositHalfInput = page.getByLabel('Forward amount multicall');
    await depositHalfInput.fill(depositAmount);

    const mintAmount = '12345';
    const formattedMintAMount = '12,345';
    const mintInput = page.getByLabel('Mint amount multicall');
    await mintInput.fill(mintAmount);

    const forwardHalfAndMintButton = getButtonByText(
      page,
      'Deposit And Mint Multicall'
    );
    await expectButtonToBeEnabled(forwardHalfAndMintButton);
    await page.waitForTimeout(1000); // Wait for slow VM
    await forwardHalfAndMintButton.click();
    await page.waitForTimeout(1000); // Wait for slow VM

    const walletNotificationPage =
      await fuelWalletTestHelper.getWalletPopupPage();

    // test forward eth amount is correct
    await hasText(walletNotificationPage, `${depositAmount} ETH`);

    // test mint asset name is shown
    await hasText(walletNotificationPage, 'Unknown', 0, 5000, true);
    // test mint asset id is shown
    const assetId = calculateAssetId(MAIN_CONTRACT_ID, await getBaseAssetId());
    // test mint amount is correct
    await hasText(walletNotificationPage, `${formattedMintAMount} Unknown`);

    // test gas fee is shown and correct
    await hasText(walletNotificationPage, 'Fee (network)');

    await checkAddresses(
      { address: fuelWallet.address.toString(), isContract: false },
      { address: MAIN_CONTRACT_ID, isContract: true },
      walletNotificationPage
    );

    // Test approve
    const preDepositBalanceEth = await fuelWallet.getBalance();
    const preDepositBalanceTkn = await fuelWallet.getBalance(assetId);
    await page.waitForTimeout(5000);
    await fuelWalletTestHelper.walletApprove();
    await waitSuccessTransaction(page);
    const postDepositBalanceEth = await fuelWallet.getBalance();
    const postDepositBalanceTkn = await fuelWallet.getBalance(assetId);
    expect(
      Number.parseFloat(
        preDepositBalanceEth.sub(postDepositBalanceEth).format({ precision: 3 })
      )
    ).toBe(Number.parseFloat(depositAmount));
    expect(
      postDepositBalanceTkn
        .sub(preDepositBalanceTkn)
        .mul(10)
        .format({ units: 1, precision: 0 })
    ).toBe(formattedMintAMount);
  });
});
