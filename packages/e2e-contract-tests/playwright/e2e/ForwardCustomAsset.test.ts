import type { FuelWalletTestHelper } from '@fuel-wallet/test-utils';
import { test, getButtonByText, hasText } from '@fuel-wallet/test-utils';
import type { WalletUnlocked } from 'fuels';
import { bn, BaseAssetId } from 'fuels';

import { CustomAssetAbi__factory } from '../../src/contracts';
import type { IdentityInput } from '../../src/contracts/CustomAssetAbi';
import '../../load.envs';
import { calculateAssetId, shortAddress } from '../../src/utils';
import { testSetup } from '../utils';

import { checkFee, connect } from './utils';

const { VITE_CONTRACT_ID } = process.env;

test.describe('Forward Custom Asset', () => {
  let fuelWallet: WalletUnlocked;
  let fuelWalletTestHelper: FuelWalletTestHelper;

  test.beforeEach(async ({ context, extensionId, page }) => {
    ({ fuelWallet, fuelWalletTestHelper } = await testSetup({
      context,
      page,
      extensionId,
    }));
  });

  test('e2e forward custom asset', async ({ page }) => {
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

    const walletNotificationPage =
      await fuelWalletTestHelper.getWalletNotificationPage();

    // test the asset name is shown
    await hasText(walletNotificationPage, 'Unknown', 0, 5000, true);

    // test asset id is correct
    const assetId = calculateAssetId(VITE_CONTRACT_ID!, BaseAssetId);
    await hasText(walletNotificationPage, shortAddress(assetId));

    // test forward custom asset amount is correct
    await hasText(walletNotificationPage, forwardCustomAssetAmount);

    // test gas fee is correct
    await hasText(walletNotificationPage, 'Fee (network)');
    const fee = bn.parseUnits('0.000000126');
    await checkFee(walletNotificationPage, {
      minFee: fee.sub(100),
      maxFee: fee.add(100),
    });
  });
});
