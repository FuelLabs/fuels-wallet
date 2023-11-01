import type { FuelWalletTestHelper } from '@fuel-wallet/playwright-utils';
import { test, getButtonByText, hasText } from '@fuel-wallet/playwright-utils';
import { BaseAssetId, bn } from 'fuels';

import '../../load.envs';
import { shortAddress } from '../../src/utils';
import { testSetup } from '../utils';

import { checkFee, connect } from './utils';

test.describe('Forward Eth', () => {
  let fuelWalletTestHelper: FuelWalletTestHelper;

  test.beforeEach(async ({ context, extensionId, page }) => {
    ({ fuelWalletTestHelper } = await testSetup({
      context,
      page,
      extensionId,
    }));
  });

  test('e2e forward ETH', async ({ page }) => {
    await connect(page, fuelWalletTestHelper);

    const forwardEthAmount = '1.2345';
    const forwardEthInput = page
      .getByLabel('Forward eth card')
      .locator('input');
    await forwardEthInput.fill(forwardEthAmount);

    const forwardEthButton = getButtonByText(page, 'Forward ETH');
    await page.waitForTimeout(2500);
    await forwardEthButton.click();

    const walletNotificationPage =
      await fuelWalletTestHelper.getWalletNotificationPage();

    // test the asset name is shown
    await hasText(walletNotificationPage, 'Ethereum');

    // test asset id is correct
    await hasText(walletNotificationPage, shortAddress(BaseAssetId));

    // test forward eth amount is correct
    await hasText(walletNotificationPage, `${forwardEthAmount} ETH`);

    // test gas fee is correct
    await hasText(walletNotificationPage, 'Fee (network)');
    const fee = bn.parseUnits('0.000000114');
    await checkFee(walletNotificationPage, {
      minFee: fee.sub(100),
      maxFee: fee.add(100),
    });
  });
});
