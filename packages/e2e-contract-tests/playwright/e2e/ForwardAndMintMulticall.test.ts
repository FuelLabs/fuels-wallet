import { test, getButtonByText, hasText } from '@fuels/playwright-utils';
import type { FuelWalletTestHelper } from '@fuels/playwright-utils';
import { expect } from '@playwright/test';
import { BaseAssetId, bn, toBech32 } from 'fuels';
import type { WalletUnlocked } from 'fuels';

import { shortAddress, calculateAssetId } from '../../src/utils';
import '../../load.envs.js';
import { testSetup } from '../utils';

import { MAIN_CONTRACT_ID } from './config';
import { checkFee, connect, checkAddresses } from './utils';

test.describe('Forward and Mint Multicall', () => {
  let fuelWalletTestHelper: FuelWalletTestHelper;
  let fuelWallet: WalletUnlocked;

  test.beforeEach(async ({ context, extensionId, page }) => {
    ({ fuelWalletTestHelper, fuelWallet } = await testSetup({
      context,
      page,
      extensionId,
    }));
  });

  test('e2e forward and mint multicall', async ({ page }) => {
    await connect(page, fuelWalletTestHelper);

    const depositAmount = '1.000';
    const depositHalfInput = page.getByLabel('Forward amount multicall');
    await depositHalfInput.fill(depositAmount);

    const mintAmount = '1.2345';
    const mintInput = page.getByLabel('Mint amount multicall');
    await mintInput.fill(mintAmount);

    const forwardHalfAndMintButton = getButtonByText(
      page,
      'Deposit And Mint Multicall'
    );
    await page.waitForTimeout(2500);
    await forwardHalfAndMintButton.click();

    const walletNotificationPage =
      await fuelWalletTestHelper.getWalletPopupPage();

    // test forward asset name is shown
    await hasText(walletNotificationPage, 'Ethereum');
    // test forward asset id is shown
    await hasText(walletNotificationPage, shortAddress(BaseAssetId));
    // test forward eth amount is correct
    await hasText(walletNotificationPage, `${depositAmount} ETH`);

    // test mint asset name is shown
    await hasText(walletNotificationPage, 'Unknown', 0, 5000, true);
    // test mint asset id is shown
    const assetId = calculateAssetId(MAIN_CONTRACT_ID, BaseAssetId);
    await hasText(walletNotificationPage, shortAddress(assetId));
    // test mint amount is correct
    await hasText(walletNotificationPage, mintAmount);

    // test gas fee is shown and correct
    await hasText(walletNotificationPage, 'Fee (network)');
    const fee = bn.parseUnits('0.000000217');
    await checkFee(walletNotificationPage, {
      minFee: fee.sub(100),
      maxFee: fee.add(100),
    });

    const fuelContractId = toBech32(MAIN_CONTRACT_ID);
    await checkAddresses(
      { address: fuelWallet.address.toAddress(), isContract: false },
      { address: fuelContractId, isContract: true },
      walletNotificationPage
    );
    await checkAddresses(
      { address: fuelContractId, isContract: true },
      { address: fuelWallet.address.toAddress(), isContract: false },
      walletNotificationPage
    );

    // Test approve
    const preDepositBalanceEth = await fuelWallet.getBalance();
    const preDepositBalanceTkn = await fuelWallet.getBalance(assetId);
    await fuelWalletTestHelper.walletApprove();
    await hasText(page, 'Transaction successful.');
    const postDepositBalanceEth = await fuelWallet.getBalance();
    const postDepositBalanceTkn = await fuelWallet.getBalance(assetId);
    expect(
      parseFloat(
        preDepositBalanceEth
          .sub(postDepositBalanceEth)
          .format({ precision: 6, units: 9 })
      )
    ).toBe(parseFloat(depositAmount));
    expect(
      parseFloat(
        postDepositBalanceTkn
          .sub(preDepositBalanceTkn)
          .format({ precision: 6, units: 9 })
      )
    ).toBe(parseFloat(mintAmount));
  });
});
