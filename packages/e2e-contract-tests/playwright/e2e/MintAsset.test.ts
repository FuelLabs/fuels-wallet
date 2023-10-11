import {
  test,
  walletSetup,
  getButtonByText,
  getWalletPage,
  hasText,
  walletConnect,
  FUEL_MNEMONIC,
  seedWallet,
  walletApprove,
  addAsset,
} from '@fuel-wallet/test-utils';
import type { WalletUnlocked } from 'fuels';
import { Provider, Wallet, bn } from 'fuels';

import { shortAddress, calculateAssetId } from '../../src/utils';
import '../../load.envs.js';

const { FUEL_PROVIDER_URL, WALLET_SECRET } = process.env;

test.describe('Mint Assets', () => {
  let fuelWallet: WalletUnlocked;

  test.beforeEach(async ({ context, extensionId, page }) => {
    await walletSetup(context, extensionId, page, FUEL_PROVIDER_URL!);
    const fuelProvider = await Provider.create(FUEL_PROVIDER_URL!);
    fuelWallet = Wallet.fromMnemonic(FUEL_MNEMONIC, fuelProvider);
    await seedWallet(
      fuelWallet.address.toString(),
      bn(1_000_000_000),
      FUEL_PROVIDER_URL!,
      WALLET_SECRET!
    );
    await page.goto('/');
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
    const walletPage = await getWalletPage(context);
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

    await mintButton.click();

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
