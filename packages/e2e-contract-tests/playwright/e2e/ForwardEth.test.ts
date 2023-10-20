import {
  test,
  getButtonByText,
  walletConnect,
  getWalletPage,
  hasText,
} from '@fuel-wallet/test-utils';
import { BaseAssetId } from 'fuels';

import '../../load.envs';
import { shortAddress } from '../../src/utils';
import { testSetup } from '../utils';

import { checkFee } from './utils';

test.describe('Forward Eth', () => {
  test.beforeEach(async ({ context, extensionId, page }) => {
    await testSetup({ context, page, extensionId });
  });

  test('e2e forward ETH', async ({ context, page }) => {
    const connectButton = getButtonByText(page, 'Connect');
    await connectButton.click();
    await walletConnect(context);

    const forwardEthAmount = '1.2345';
    const forwardEthInput = page
      .getByLabel('Forward eth card')
      .locator('input');
    await forwardEthInput.fill(forwardEthAmount);

    const forwardEthButton = getButtonByText(page, 'Forward ETH');
    await page.waitForTimeout(2500);
    await forwardEthButton.click();

    const walletPage = await getWalletPage(context);

    // test the asset name is shown
    await hasText(walletPage, 'Ethereum');

    // test asset id is correct
    await hasText(walletPage, shortAddress(BaseAssetId));

    // test forward eth amount is correct
    await hasText(walletPage, `${forwardEthAmount} ETH`);

    // test gas fee is correct
    await hasText(walletPage, 'Fee (network)');
    await checkFee(walletPage, '0.000000114 ETH');
  });
});
