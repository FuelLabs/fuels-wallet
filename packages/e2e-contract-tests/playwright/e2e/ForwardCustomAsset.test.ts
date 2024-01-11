import type { FuelWalletTestHelper } from '@fuel-wallet/playwright-utils';
import { test, getButtonByText, hasText } from '@fuel-wallet/playwright-utils';
import { expect } from '@playwright/test';
import type { WalletUnlocked } from 'fuels';
import { bn, BaseAssetId, toBech32 } from 'fuels';

import { CustomAssetAbi__factory } from '../../src/contracts';
import type { IdentityInput } from '../../src/contracts/contracts/CustomAssetAbi';
import '../../load.envs';
import { calculateAssetId, shortAddress } from '../../src/utils';
import { testSetup } from '../utils';

import { MAIN_CONTRACT_ID } from './config';
import { checkFee, connect, checkAddresses } from './utils';

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
      MAIN_CONTRACT_ID,
      fuelWallet
    );
    const recipient: IdentityInput = {
      Address: {
        value: fuelWallet.address.toHexString(),
      },
    };
    const response = await contract.functions
      .mint(recipient, BaseAssetId, bn(100_000_000_000))
      .txParams({ gasPrice: 1, gasLimit: 1_000_000 })
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
      await fuelWalletTestHelper.getWalletPopupPage();

    // test the asset name is shown
    await hasText(walletNotificationPage, 'Unknown', 0, 5000, true);

    // test asset id is correct
    const assetId = calculateAssetId(MAIN_CONTRACT_ID, BaseAssetId);
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

    const fuelContractId = toBech32(MAIN_CONTRACT_ID);
    await checkAddresses(
      { address: fuelWallet.address.toAddress(), isContract: false },
      { address: fuelContractId, isContract: true },
      walletNotificationPage
    );

    // Test approve
    const preDepositBalanceTkn = await fuelWallet.getBalance(assetId);
    await fuelWalletTestHelper.walletApprove();
    await hasText(page, 'Transaction successful.');
    const postDepositBalanceTkn = await fuelWallet.getBalance(assetId);
    expect(
      parseFloat(
        preDepositBalanceTkn
          .sub(postDepositBalanceTkn)
          .format({ precision: 6, units: 9 })
      )
    ).toBe(parseFloat(forwardCustomAssetAmount));
  });
});
