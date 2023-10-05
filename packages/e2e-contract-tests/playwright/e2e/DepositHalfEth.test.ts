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

import { shortAddress } from '../../src/utils';
import '../../load.envs.js';

const { FUEL_PROVIDER_URL, WALLET_SECRET } = process.env;

test.describe('Deposit Half ETH', () => {
  test.beforeEach(async ({ context, extensionId, page }) => {
    await walletSetup(context, extensionId, page);
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

  test('e2e deposit half eth', async ({ context, page }) => {
    const connectButton = getButtonByText(page, 'Connect');
    await connectButton.click();
    await walletConnect(context);

    const depositAmount = '1.000';
    const halfDepositAmount = '0.500';
    const depositHalfInput = page
      .getByLabel('Deposit half eth card')
      .locator('input');
    await depositHalfInput.fill(depositAmount);

    const depositHalfButton = getButtonByText(page, 'Deposit Half ETH');
    await depositHalfButton.click();

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

    // test gas fee is shown and correct
    await hasText(walletPage, 'Fee (network)');
    await hasText(walletPage, '0.000000001 ETH');
  });
});
