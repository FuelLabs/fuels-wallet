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

import { CustomAssetAbi__factory } from '../../src/contracts';
import type { IdentityInput } from '../../src/contracts/CustomAssetAbi';
import '../../load.envs';
import { calculateAssetId, shortAddress } from '../../src/utils';

const { FUEL_PROVIDER_URL, WALLET_SECRET, VITE_CONTRACT_ID } = process.env;

test.describe('Forward Custom Asset', () => {
  let fuelWallet: WalletUnlocked;

  test.beforeEach(async ({ context, extensionId, page }) => {
    await walletSetup(context, extensionId, page);
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

  test('e2e forward custom asset', async ({ context, page }) => {
    const connectButton = getButtonByText(page, 'Connect');
    await connectButton.click();
    await walletConnect(context);

    // Mint custom asset to wallet
    const contract = CustomAssetAbi__factory.connect(
      VITE_CONTRACT_ID!,
      fuelWallet
    );
    const recipient: IdentityInput = {
      Address: {
        value: fuelWallet.address.toHexString(),
      },
    };
    const response = await contract.functions
      .mint(recipient, BaseAssetId, bn(100_000_000_000))
      .txParams({ gasPrice: 1 })
      .call();
    await response.transactionResponse.waitForResult();

    const forwardCustomAssetAmount = '1.2345';
    const forwardCustomAssetInput = page
      .getByLabel('Forward custom asset card')
      .locator('input');
    await forwardCustomAssetInput.fill(forwardCustomAssetAmount);

    const forwardCustomAssetButton = getButtonByText(
      page,
      'Forward Custom Asset'
    );
    await forwardCustomAssetButton.click();

    const walletPage = await getWalletPage(context);

    // test the asset name is shown
    await hasText(walletPage, 'Unknown', 0, 5000, true);

    // test asset id is correct
    const assetId = calculateAssetId(VITE_CONTRACT_ID!, BaseAssetId);
    await hasText(walletPage, shortAddress(assetId));

    // test forward custom asset amount is correct
    await hasText(walletPage, forwardCustomAssetAmount);

    // test gas fee is correct
    await hasText(walletPage, 'Fee (network)');
    await hasText(walletPage, '0.000000001 ETH');
  });
});
