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

test.describe('Forward Half ETH and Mint Custom Asset', () => {
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

  test('e2e forward half eth and mint custom asset', async ({ page }) => {
    await connect(page, fuelWalletTestHelper);

    const depositHalfInput = page.getByLabel('Forward amount', { exact: true });
    await depositHalfInput.fill(depositAmount);

    const mintAmount = '12345';
    const formattedMintAmount = '12,345';
    const mintInput = page.getByLabel('Mint amount', { exact: true });
    await mintInput.fill(mintAmount);

    const forwardHalfAndMintButton = getButtonByText(
      page,
      'Forward Half And Mint'
    );
    await expectButtonToBeEnabled(forwardHalfAndMintButton);
    await forwardHalfAndMintButton.click();

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

    // test forward asset name is shown
    await hasText(walletNotificationPage, 'Ethereum');
    // test forward asset id is shown
    await hasText(walletNotificationPage, shortAddress(await getBaseAssetId()));
    // test forward eth amount is correct
    await hasText(walletNotificationPage, `${depositAmount} ETH`);

    // test return asset name is shown
    await hasText(walletNotificationPage, 'Ethereum', 1);
    // test return asset id is shown
    await hasText(
      walletNotificationPage,
      shortAddress(await getBaseAssetId()),
      1
    );
    // test return eth amount is correct
    await hasText(walletNotificationPage, `${halfDepositAmount} ETH`);

    // test mint asset name is shown
    await hasText(walletNotificationPage, 'Unknown', 0, 5000, true);
    // test mint asset id is shown
    const assetId = calculateAssetId(MAIN_CONTRACT_ID, await getBaseAssetId());
    await hasText(walletNotificationPage, shortAddress(assetId));
    // test mint amount is correct
    await hasText(walletNotificationPage, formattedMintAmount);

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
