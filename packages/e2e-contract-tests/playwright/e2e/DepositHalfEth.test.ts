import type { FuelWalletTestHelper } from '@fuel-wallet/playwright-utils';
import { test, getButtonByText, hasText } from '@fuel-wallet/playwright-utils';
import { BaseAssetId, bn } from 'fuels';

import { shortAddress } from '../../src/utils';
import '../../load.envs.js';
import { testSetup } from '../utils';

import { checkFee, connect } from './utils';

test.describe('Deposit Half ETH', () => {
  let fuelWalletTestHelper: FuelWalletTestHelper;

  test.beforeEach(async ({ context, extensionId, page }) => {
    ({ fuelWalletTestHelper } = await testSetup({
      context,
      page,
      extensionId,
    }));
  });

  test('e2e deposit half eth', async ({ page }) => {
    await connect(page, fuelWalletTestHelper);

    const depositAmount = '1.000';
    const halfDepositAmount = '0.500';
    const depositHalfInput = page
      .getByLabel('Deposit half eth card')
      .locator('input');
    await depositHalfInput.fill(depositAmount);

    const depositHalfButton = getButtonByText(page, 'Deposit Half ETH', true);

    await page.waitForTimeout(3000);
    await depositHalfButton.click();

    const walletNotificationPage =
      await fuelWalletTestHelper.getWalletNotificationPage();

    // test forward asset name is shown
    await hasText(walletNotificationPage, 'Ethereum');
    // test forward asset id is shown
    await hasText(walletNotificationPage, shortAddress(BaseAssetId));
    // test forward eth amount is correct
    await hasText(walletNotificationPage, `${depositAmount} ETH`);

    // test return asset name is shown
    await hasText(walletNotificationPage, 'Ethereum', 1);
    // test return asset id is shown
    await hasText(walletNotificationPage, shortAddress(BaseAssetId), 1);
    // test return eth amount is correct
    await hasText(walletNotificationPage, `${halfDepositAmount} ETH`);

    // test gas fee is shown and correct
    await hasText(walletNotificationPage, 'Fee (network)');
    const fee = bn.parseUnits('0.000000152');
    await checkFee(walletNotificationPage, {
      minFee: fee.sub(100),
      maxFee: fee.add(100),
    });
  });
});
