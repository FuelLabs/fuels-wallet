import type { FuelWalletTestHelper } from '@fuel-wallet/playwright-utils';
import { test, getButtonByText, hasText } from '@fuel-wallet/playwright-utils';
import { BaseAssetId, bn } from 'fuels';

import { shortAddress, calculateAssetId } from '../../src/utils';
import '../../load.envs.js';
import { testSetup } from '../utils';

import { checkFee, connect } from './utils';

const { VITE_CONTRACT_ID } = process.env;

test.describe('Forward and Mint Multicall', () => {
  let fuelWalletTestHelper: FuelWalletTestHelper;

  test.beforeEach(async ({ context, extensionId, page }) => {
    ({ fuelWalletTestHelper } = await testSetup({
      context,
      page,
      extensionId,
    }));
  });

  test('e2e foreward and mint multicall', async ({ page }) => {
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
      await fuelWalletTestHelper.getWalletNotificationPage();

    // test forward asset name is shown
    await hasText(walletNotificationPage, 'Ethereum');
    // test forward asset id is shown
    await hasText(walletNotificationPage, shortAddress(BaseAssetId));
    // test forward eth amount is correct
    await hasText(walletNotificationPage, `${depositAmount} ETH`);

    // test mint asset name is shown
    await hasText(walletNotificationPage, 'Unknown', 0, 5000, true);
    // test mint asset id is shown
    const assetId = calculateAssetId(VITE_CONTRACT_ID!, BaseAssetId);
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
  });
});
