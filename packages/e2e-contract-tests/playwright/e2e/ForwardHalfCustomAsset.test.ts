import type { FuelWalletTestHelper } from '@fuels/playwright-utils';
import { getButtonByText, hasText } from '@fuels/playwright-utils';
import { expect } from '@playwright/test';
import type { WalletUnlocked } from 'fuels';
import { bn, toBech32 } from 'fuels';

import '../../load.envs';
import { CustomAssetAbi__factory } from '../../src/contracts';
import type { IdentityInput } from '../../src/contracts/contracts/CustomAssetAbi';
import {
  calculateAssetId,
  getBaseAssetId,
  shortAddress,
} from '../../src/utils';
import { testSetup, transferMaxBalance } from '../utils';

import { MAIN_CONTRACT_ID } from './config';
import { test, useLocalCRX } from './test';
import { checkAddresses, connect, waitSuccessTransaction } from './utils';

useLocalCRX();
test.describe('Forward Half Custom Asset', () => {
  let fuelWallet: WalletUnlocked;
  let fuelWalletTestHelper: FuelWalletTestHelper;
  let masterWallet: WalletUnlocked;

  const forwardCustomAssetAmount = '0.010';
  const halfForwardCustomAssetAmount = '0.005';

  test.beforeEach(async ({ context, extensionId, page }) => {
    ({ fuelWallet, fuelWalletTestHelper, masterWallet } = await testSetup({
      context,
      page,
      extensionId,
      amountToFund: bn.parseUnits(forwardCustomAssetAmount).mul(2),
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
    const contract = CustomAssetAbi__factory.connect(
      MAIN_CONTRACT_ID,
      fuelWallet
    );
    const recipient: IdentityInput = {
      Address: {
        bits: fuelWallet.address.toB256(),
      },
    };
    const response = await contract.functions
      .mint(recipient, await getBaseAssetId(), bn(100_000_000_000))
      .txParams({ gasLimit: 1_000_000 })
      .call();
    await response.transactionResponse.waitForResult();

    const forwardHalfCustomAssetInput = page
      .getByLabel('Forward half custom asset card')
      .locator('input');
    await forwardHalfCustomAssetInput.fill(forwardCustomAssetAmount);

    const forwardHalfCustomAssetButton = getButtonByText(
      page,
      'Forward Half Custom Asset'
    );
    await page.waitForTimeout(2500);
    await forwardHalfCustomAssetButton.click();

    const walletNotificationPage =
      await fuelWalletTestHelper.getWalletPopupPage();

    // test the forward asset name is shown
    await hasText(walletNotificationPage, 'Unknown', 0, 5000, true);
    // test forward asset id is correct
    const assetId = calculateAssetId(MAIN_CONTRACT_ID, await getBaseAssetId());
    await hasText(walletNotificationPage, shortAddress(assetId));
    // test forward custom asset amount is correct
    await hasText(walletNotificationPage, forwardCustomAssetAmount);

    // test return asset name is shown
    await hasText(walletNotificationPage, 'Unknown', 1, 5000, true);
    // test return asset id is shown
    await hasText(walletNotificationPage, shortAddress(assetId), 1);
    // test return asset amount is correct
    await hasText(walletNotificationPage, halfForwardCustomAssetAmount);

    // test gas fee is correct
    await hasText(walletNotificationPage, 'Fee (network)');
    // const fee = bn.parseUnits('0.000002748');
    // await checkFee(walletNotificationPage, {
    //   minFee: fee.sub(100),
    //   maxFee: fee.add(100),
    // });

    // test to and from addresses
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
    const preDepositBalanceTkn = await fuelWallet.getBalance(assetId);
    await fuelWalletTestHelper.walletApprove();
    await waitSuccessTransaction(page);
    const postDepositBalanceTkn = await fuelWallet.getBalance(assetId);
    expect(
      Number.parseFloat(
        preDepositBalanceTkn
          .sub(postDepositBalanceTkn)
          .format({ precision: 6, units: 9 })
      )
    ).toBe(Number.parseFloat(halfForwardCustomAssetAmount));
  });
});
