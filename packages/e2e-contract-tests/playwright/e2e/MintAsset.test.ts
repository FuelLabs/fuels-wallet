import {
  test,
  getButtonByText,
  getWalletPage,
  hasText,
  walletConnect,
} from '@fuel-wallet/test-utils';

import { shortAddress, calculateAssetId } from '../../src/utils';
import '../../load.envs.js';
import { testSetup } from '../utils';

test.describe('Mint Assets', () => {
  test.beforeEach(async ({ context, extensionId, page }) => {
    await testSetup({ context, page, extensionId });
  });

  test('e2e mint assets', async ({ context, page }) => {
    const connectButton = getButtonByText(page, 'Connect');
    await connectButton.click();
    await walletConnect(context);

    const mintAmount = '1.2345';
    const mintInput = page.getByLabel('Mint asset card').locator('input');
    await mintInput.fill(mintAmount);

    const mintButton = getButtonByText(page, 'Mint', true);
    await page.waitForTimeout(3000);
    await mintButton.click();

    // test asset is correct
    const assetId = calculateAssetId(process.env.VITE_CONTRACT_ID!);
    const walletPage = await getWalletPage(context);
    // short address function copied from app package
    await hasText(walletPage, shortAddress(assetId), 0, 10000);

    // test mint amount is correct
    await hasText(walletPage, mintAmount);

    // test gas fee is shown and correct
    await hasText(walletPage, 'Fee (network)');
    // 0.000000001 since we hardcode a gas price of 1 in our mint function
    await hasText(walletPage, '0.000000001 ETH');
  });
});
