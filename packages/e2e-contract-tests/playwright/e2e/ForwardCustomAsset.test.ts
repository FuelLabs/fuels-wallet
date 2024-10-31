import {
  expectButtonToBeEnabled,
  getButtonByText,
  hasText,
} from '@fuels/playwright-utils';
import type { FuelWalletTestHelper } from '@fuels/playwright-utils';
import { expect } from '@playwright/test';
import type { WalletUnlocked } from 'fuels';
import { bn } from 'fuels';

import '../../load.envs';
import { CustomAsset } from '../../src/contracts/contracts';
import type { IdentityInput } from '../../src/contracts/contracts/CustomAssetAbi';
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

test.describe('Forward Custom Asset', () => {
  let fuelWallet: WalletUnlocked;
  let fuelWalletTestHelper: FuelWalletTestHelper;
  let masterWallet: WalletUnlocked;

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

  test('e2e forward custom asset', async ({ page }) => {
    await connect(page, fuelWalletTestHelper);

    // Mint custom asset to wallet
    const contract = new CustomAsset(MAIN_CONTRACT_ID, fuelWallet);
    const recipient: IdentityInput = {
      Address: {
        bits: fuelWallet.address.toB256(),
      },
    };
    const { waitForResult } = await contract.functions
      .mint(recipient, await getBaseAssetId(), bn(100_000_000_000))
      .call();

    await waitForResult();

    const forwardCustomAssetAmount = '12345';
    const formattedForwardCustomAssetAmount = '12,345';
    const forwardCustomAssetInput = page
      .getByLabel('Forward custom asset card')
      .getByRole('textbox');
    await forwardCustomAssetInput.fill(forwardCustomAssetAmount);

    const forwardCustomAssetButton = getButtonByText(
      page,
      'Forward Custom Asset'
    );
    await expectButtonToBeEnabled(forwardCustomAssetButton);
    await forwardCustomAssetButton.click();

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

    // test the asset name is shown
    await hasText(walletNotificationPage, 'Unknown', 0, 5000, true);

    // test asset id is correct
    const assetId = calculateAssetId(MAIN_CONTRACT_ID, await getBaseAssetId());
    await hasText(walletNotificationPage, shortAddress(assetId));

    // test forward custom asset amount is correct
    await hasText(walletNotificationPage, formattedForwardCustomAssetAmount);

    // test gas fee is correct
    await hasText(walletNotificationPage, 'Fee (network)');

    await checkAddresses(
      { address: fuelWallet.address.toString(), isContract: false },
      { address: MAIN_CONTRACT_ID, isContract: true },
      walletNotificationPage
    );

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
    ).toBe(formattedForwardCustomAssetAmount);
  });
});
