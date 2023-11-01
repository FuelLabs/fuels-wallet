import type { FuelWalletTestHelper } from '@fuel-wallet/playwright-utils';
import { test, getButtonByText, hasText } from '@fuel-wallet/playwright-utils';
import { bn } from 'fuels';

import { shortAddress, calculateAssetId } from '../../src/utils';
import '../../load.envs.js';
import { testSetup } from '../utils';

import { checkFee, connect } from './utils';

test.describe('Mint Assets', () => {
  let fuelWalletTestHelper: FuelWalletTestHelper;

  test.beforeEach(async ({ context, extensionId, page }) => {
    ({ fuelWalletTestHelper } = await testSetup({
      context,
      page,
      extensionId,
    }));
  });

  test('e2e mint unknown assets', async ({ page }) => {
    await connect(page, fuelWalletTestHelper);

    const mintAmount = '1.2345';
    const mintInput = page.getByLabel('Mint asset card').locator('input');
    await mintInput.fill(mintAmount);

    const mintButton = getButtonByText(page, 'Mint', true);
    await page.waitForTimeout(3000);
    await mintButton.click();

    // test asset is correct
    const assetId = calculateAssetId(process.env.VITE_CONTRACT_ID!);
    const walletNotificationPage =
      await fuelWalletTestHelper.getWalletNotificationPage();
    // short address function copied from app package
    await hasText(walletNotificationPage, shortAddress(assetId), 0, 10000);

    // test mint amount is correct
    await hasText(walletNotificationPage, mintAmount);

    // test gas fee is shown and correct
    await hasText(walletNotificationPage, 'Fee (network)');
    const fee = bn.parseUnits('0.00000013');
    await checkFee(walletNotificationPage, {
      minFee: fee.sub(100),
      maxFee: fee.add(100),
    });
  });

  test('e2e mint known asset', async ({ page }) => {
    await connect(page, fuelWalletTestHelper);

    const subId =
      '0x0000000000000000000000000000000000000000000000000000000000000001';
    const name = 'Token';
    const symbol = 'TKN';
    const decimals = '6';
    const assetId = calculateAssetId(process.env.VITE_CONTRACT_ID!, subId);

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
    await page.waitForTimeout(3000);
    await mintButton.click();

    // test asset is correct
    const walletNotificationPage =
      await fuelWalletTestHelper.getWalletNotificationPage();

    await hasText(walletNotificationPage, name);
    await hasText(walletNotificationPage, shortAddress(assetId), 0, 10000);
    // test mint amount is correct
    await hasText(walletNotificationPage, `1.2345 ${symbol}`);

    // test gas fee is shown and correct
    await hasText(walletNotificationPage, 'Fee (network)');
    const fee = bn.parseUnits('0.000000133');
    await checkFee(walletNotificationPage, {
      minFee: fee.sub(100),
      maxFee: fee.add(100),
    });
  });
});
