import {
  test,
  getButtonByText,
  getWalletPage,
  hasText,
  walletConnect,
} from '@fuel-wallet/test-utils';
import { BaseAssetId } from 'fuels';

import { shortAddress, calculateAssetId } from '../../src/utils';
import '../../load.envs.js';
import { testSetup } from '../utils';

import { checkFee } from './utils';

const { VITE_CONTRACT_ID } = process.env;

test.describe('Forward Half ETH and Mint Custom Asset', () => {
  test.beforeEach(async ({ context, extensionId, page }) => {
    await testSetup({ context, page, extensionId });
  });

  test('e2e foreward half eth and mint custom asset', async ({
    context,
    page,
  }) => {
    const connectButton = getButtonByText(page, 'Connect');
    await connectButton.click();
    await walletConnect(context);

    const depositAmount = '1.000';
    const halfDepositAmount = '0.500';
    const depositHalfInput = page.getByLabel('Forward amount', { exact: true });
    await depositHalfInput.fill(depositAmount);

    const mintAmount = '1.2345';
    const mintInput = page.getByLabel('Mint amount', { exact: true });
    await mintInput.fill(mintAmount);

    const forwardHalfAndMintButton = getButtonByText(
      page,
      'Forward Half And Mint',
    );
    await forwardHalfAndMintButton.click();

    const walletPage = await getWalletPage(context);

    // test forward asset name is shown
    await hasText(walletPage, 'Ethereum');
    // test forward asset id is shown
    await hasText(walletPage, shortAddress(BaseAssetId));
    // test forward eth amount is correct
    await hasText(walletPage, `${depositAmount} ETH`);

    // test return asset name is shown
    await hasText(walletPage, 'Ethereum', 1);
    // test return asset id is shown
    await hasText(walletPage, shortAddress(BaseAssetId), 1);
    // test return eth amount is correct
    await hasText(walletPage, `${halfDepositAmount} ETH`);

    // test mint asset name is shown
    await hasText(walletPage, 'Unknown', 0, 5000, true);
    // test mint asset id is shown
    const assetId = calculateAssetId(VITE_CONTRACT_ID!, BaseAssetId);
    await hasText(walletPage, shortAddress(assetId));
    // test mint amount is correct
    await hasText(walletPage, mintAmount);

    // test gas fee is shown and correct
    await hasText(walletPage, 'Fee (network)');
    await checkFee(walletPage, '0.00000021 ETH');
  });
});
