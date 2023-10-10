import {
  test,
  walletSetup,
  seedWallet,
  FUEL_MNEMONIC,
  getButtonByText,
  walletConnect,
  getWalletPage,
  hasText,
} from '@fuel-wallet/test-utils';
import type { WalletUnlocked } from 'fuels';
import { Wallet, Provider, bn, BaseAssetId } from 'fuels';

import '../../load.envs';
import { shortAddress } from '../../src/utils';

const { FUEL_PROVIDER_URL, WALLET_SECRET } = process.env;

test.describe('Forward Eth', () => {
  let fuelWallet: WalletUnlocked;

  test.beforeEach(async ({ context, extensionId, page }) => {
    await walletSetup(context, extensionId, page, FUEL_PROVIDER_URL!);
    const fuelProvider = await Provider.create(FUEL_PROVIDER_URL!);
    fuelWallet = Wallet.fromMnemonic(FUEL_MNEMONIC, fuelProvider);
    await seedWallet(
      fuelWallet.address.toString(),
      bn(100_000_000_000),
      FUEL_PROVIDER_URL!,
      WALLET_SECRET!
    );
    await page.goto('/');
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
    await hasText(walletPage, '0.000000001 ETH');
  });
});
