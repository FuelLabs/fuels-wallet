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
import { shortAddress, calculateAssetId } from '../../src/utils';
import '../../load.envs.js';
import { Provider, Wallet, WalletUnlocked, bn } from 'fuels';

const { FUEL_PROVIDER_URL, WALLET_SECRET } = process.env;

test.describe('Mint Assets', () => {
  let fuelWallet: WalletUnlocked;

  test.beforeEach(async ({ context, extensionId, page }) => {
    await walletSetup(context, extensionId, page);
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

    const mintButton = getButtonByText(page, 'Mint');
    await mintButton.click();

    // test asset is correct
    const assetId = calculateAssetId(process.env.VITE_MINT_CONTRACT_ID!);
    const walletPage = await getWalletPage(context);
    // short address function copied from app package
    await hasText(walletPage, shortAddress(assetId));

    // test mint amount is correct
    await hasText(walletPage, mintAmount);

    // test gas fee is shown and correct
    await hasText(walletPage, 'Fee (network)');
    // 0.000000001 since we hardcode a gas price of 1 in our mint function
    await hasText(walletPage, '0.000000001 ETH');
  });
});
