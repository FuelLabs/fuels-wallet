import {
  test,
  walletSetup,
  getButtonByText,
  getWalletPage,
  hasText,
  walletConnect,
  FUEL_MNEMONIC,
  seedWallet,
} from '@fuel-wallet/test-utils';
import { BaseAssetId, Provider, Wallet, bn } from 'fuels';

import { shortAddress, calculateAssetId } from '../../src/utils';
import '../../load.envs.js';

const { FUEL_PROVIDER_URL, WALLET_SECRET, VITE_CONTRACT_ID } = process.env;

test.describe('Forward and Mint Multicall', () => {
  test.beforeEach(async ({ context, extensionId, page }) => {
    await walletSetup(context, extensionId, page, FUEL_PROVIDER_URL!);
    const fuelProvider = await Provider.create(FUEL_PROVIDER_URL!);
    const fuelWallet = Wallet.fromMnemonic(FUEL_MNEMONIC, fuelProvider);
    await seedWallet(
      fuelWallet.address.toString(),
      bn(100_000_000_000),
      FUEL_PROVIDER_URL!,
      WALLET_SECRET!
    );
    await page.goto('/');
  });

  test('e2e foreward and mint multicall', async ({ context, page }) => {
    const connectButton = getButtonByText(page, 'Connect');
    await connectButton.click();
    await walletConnect(context);

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

    const walletPage = await getWalletPage(context);

    // test forward asset name is shown
    await hasText(walletPage, 'Ethereum');
    // test forward asset id is shown
    await hasText(walletPage, shortAddress(BaseAssetId));
    // test forward eth amount is correct
    await hasText(walletPage, `${depositAmount} ETH`);

    // test mint asset name is shown
    await hasText(walletPage, 'Unknown', 0, 5000, true);
    // test mint asset id is shown
    const assetId = calculateAssetId(VITE_CONTRACT_ID!, BaseAssetId);
    await hasText(walletPage, shortAddress(assetId));
    // test mint amount is correct
    await hasText(walletPage, mintAmount);

    // test gas fee is shown and correct
    await hasText(walletPage, 'Fee (network)');
    await hasText(walletPage, '0.000000001 ETH');
  });
});
