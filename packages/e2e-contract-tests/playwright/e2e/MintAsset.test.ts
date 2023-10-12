import {
  test,
  getButtonByText,
  getWalletPage,
  hasText,
  walletConnect,
  walletApprove,
  addAsset,
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

  test('e2e mint known asset', async ({ context, page }) => {
    const connectButton = getButtonByText(page, 'Connect');
    await connectButton.click();
    await walletConnect(context);

    const mintAmount = '1.2345';
    const mintAmountInput = page.getByLabel('Asset config amount');
    await mintAmountInput.fill(mintAmount);

    const subId =
      '0x0000000000000000000000000000000000000000000000000000000000000001';
    const subIdInput = page.getByLabel('Asset config subid');
    await subIdInput.fill(subId);

    const decimals = '6';
    const decimalsInput = page.getByLabel('Asset config decimals');
    await decimalsInput.fill(decimals);

    const mintButton = getButtonByText(page, 'Mint Asset configuration');
    await page.waitForTimeout(3000);
    await mintButton.click();

    // test asset is correct
    const assetId = calculateAssetId(process.env.VITE_CONTRACT_ID!, subId);
    let walletPage = await getWalletPage(context);
    // short address function copied from app package
    await hasText(walletPage, shortAddress(assetId), 0, 10000);

    // test mint amount is correct
    await hasText(walletPage, '0.0012345');

    // test gas fee is shown and correct
    await hasText(walletPage, 'Fee (network)');
    // 0.000000001 since we hardcode a gas price of 1 in our mint function
    await hasText(walletPage, '0.000000001 ETH');

    await walletApprove(context);

    const name = 'Token';
    const symbol = 'TKN';
    // Add the unknown asset to the wallet
    await addAsset(context, assetId, name, symbol, Number(decimals));

    // TODO: figure out a way to wait until the wallet has finished loading.
    // This would be useful for a variety of functions in test-utils
    // note: await walletPage.waitForContentLoaded() does not work
    // We need to wait a little for the asset to be added to the wallet
    await page.waitForTimeout(2500);

    await mintButton.click();

    walletPage = await getWalletPage(context);

    await hasText(walletPage, name);
    await hasText(walletPage, shortAddress(assetId), 0, 10000);
    // test mint amount is correct
    await hasText(walletPage, `1.2345 ${symbol}`);

    // test gas fee is shown and correct
    await hasText(walletPage, 'Fee (network)');
    // 0.000000001 since we hardcode a gas price of 1 in our mint function
    await hasText(walletPage, '0.000000001 ETH');
  });
});
