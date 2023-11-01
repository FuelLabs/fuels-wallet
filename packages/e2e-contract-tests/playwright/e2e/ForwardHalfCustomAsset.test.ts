import type { FuelWalletTestHelper } from '@fuel-wallet/playwright-utils';
import { test, getButtonByText, hasText } from '@fuel-wallet/playwright-utils';
import type { WalletUnlocked } from 'fuels';
import { bn, BaseAssetId } from 'fuels';

import { CustomAssetAbi__factory } from '../../src/contracts';
import type { IdentityInput } from '../../src/contracts/CustomAssetAbi';
import '../../load.envs';
import { calculateAssetId, shortAddress } from '../../src/utils';
import { testSetup } from '../utils';

import { checkFee, connect } from './utils';

const { VITE_CONTRACT_ID } = process.env;

test.describe('Forward Half Custom Asset', () => {
  let fuelWallet: WalletUnlocked;
  let fuelWalletTestHelper: FuelWalletTestHelper;

  test.beforeEach(async ({ context, extensionId, page }) => {
    ({ fuelWallet, fuelWalletTestHelper } = await testSetup({
      context,
      page,
      extensionId,
    }));
  });

  test('e2e forward half custom asset', async ({ page }) => {
    await connect(page, fuelWalletTestHelper);

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

    const walletNotificationPage =
      await fuelWalletTestHelper.getWalletNotificationPage();

    // test the forward asset name is shown
    await hasText(walletNotificationPage, 'Unknown', 0, 5000, true);
    // test forward asset id is correct
    const assetId = calculateAssetId(VITE_CONTRACT_ID!, BaseAssetId);
    await hasText(walletNotificationPage, shortAddress(assetId));
    // test forward custom asset amount is correct
    await hasText(walletNotificationPage, forwardCustomAssetAmount);

    // test return asset name is shown
    await hasText(walletNotificationPage, 'Unknown', 1, 5000, true);
    // test return asset id is shown
    await hasText(walletNotificationPage, shortAddress(assetId), 1);
    // test return asset amount is correct
    await hasText(walletNotificationPage, halfForwardCustomAssetAmount);

    // test gas fee is correct
    await hasText(walletNotificationPage, 'Fee (network)');
    const fee = bn.parseUnits('0.000000165');
    await checkFee(walletNotificationPage, {
      minFee: fee.sub(100),
      maxFee: fee.add(100),
    });
  });
});
