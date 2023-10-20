import {
  test,
  getButtonByText,
  walletConnect,
  getWalletPage,
  hasText,
} from '@fuel-wallet/test-utils';
import type { WalletUnlocked } from 'fuels';
import { bn, BaseAssetId } from 'fuels';

import { CustomAssetAbi__factory } from '../../src/contracts';
import type { IdentityInput } from '../../src/contracts/CustomAssetAbi';
import '../../load.envs';
import { calculateAssetId, shortAddress } from '../../src/utils';
import { testSetup } from '../utils';

import { checkFee } from './utils';

const { VITE_CONTRACT_ID } = process.env;

test.describe('Forward Half Custom Asset', () => {
  let fuelWallet: WalletUnlocked;

  test.beforeEach(async ({ context, extensionId, page }) => {
    fuelWallet = await testSetup({ context, page, extensionId });
  });

  test('e2e forward half custom asset', async ({ context, page }) => {
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

    const forwardCustomAssetAmount = '1.000';
    const halfForwardCustomAssetAmount = '0.500';
    const forwardHalfCustomAssetInput = page
      .getByLabel('Forward half custom asset card')
      .locator('input');
    await forwardHalfCustomAssetInput.fill(forwardCustomAssetAmount);

    const forwardHalfCustomAssetButton = getButtonByText(
      page,
      'Forward Half Custom Asset'
    );
    await forwardHalfCustomAssetButton.click();

    const walletPage = await getWalletPage(context);

    // test the forward asset name is shown
    await hasText(walletPage, 'Unknown', 0, 5000, true);
    // test forward asset id is correct
    const assetId = calculateAssetId(VITE_CONTRACT_ID!, BaseAssetId);
    await hasText(walletPage, shortAddress(assetId));
    // test forward custom asset amount is correct
    await hasText(walletPage, forwardCustomAssetAmount);

    // test return asset name is shown
    await hasText(walletPage, 'Unknown', 1, 5000, true);
    // test return asset id is shown
    await hasText(walletPage, shortAddress(assetId), 1);
    // test return asset amount is correct
    await hasText(walletPage, halfForwardCustomAssetAmount);

    // test gas fee is correct
    await hasText(walletPage, 'Fee (network)');
    const fee = bn.parseUnits('0.000000165');
    await checkFee(walletPage, { minFee: fee.sub(100), maxFee: fee.add(100) });
  });
});
