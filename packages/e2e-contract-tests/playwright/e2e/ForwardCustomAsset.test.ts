import { getButtonByText, hasText } from '@fuels/playwright-utils';
import type { FuelWalletTestHelper } from '@fuels/playwright-utils';
import { expect } from '@playwright/test';
import type { WalletUnlocked } from 'fuels';
import { bn, toBech32 } from 'fuels';

import '../../load.envs';
import { CustomAssetAbi__factory } from '../../src/contracts';
import type { IdentityInput } from '../../src/contracts/contracts/CustomAssetAbi';
import {
  calculateAssetId,
  getBaseAssetId,
  shortAddress,
} from '../../src/utils';
import { testSetup, transferMaxBalance } from '../utils';

import { MAIN_CONTRACT_ID } from './config';
import { test, useLocalCRX } from './test';
import {
  checkAddresses,
  checkAriaLabelsContainsText,
  checkFee,
  connect,
  waitSuccessTransaction,
} from './utils';

useLocalCRX();

test.describe('Forward Custom Asset', () => {
  let fuelWallet: WalletUnlocked;
  let fuelWalletTestHelper: FuelWalletTestHelper;
  let masterWallet: WalletUnlocked;

  test.beforeEach(async ({ context, extensionId, page }) => {
    ({ fuelWallet, fuelWalletTestHelper, masterWallet } = await testSetup({
      context,
      page,
      extensionId,
      amountToFund: bn.parseUnits('0.001'),
    }));
  });

  test.afterEach(async () => {
    await transferMaxBalance({
      fromWallet: fuelWallet,
      toWallet: masterWallet,
    });
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
        bits: fuelWallet.address.toB256(),
      },
    };
    const response = await contract.functions
      .mint(recipient, await getBaseAssetId(), bn(100_000_000_000))
      .txParams({ gasLimit: 1_000_000 })
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

    // Test if asset name is defined (not unknown)
    checkAriaLabelsContainsText(
      walletNotificationPage,
      'Asset Name',
      'Ethereum'
    );
    // Test if sender name is defined (not unknown)
    checkAriaLabelsContainsText(walletNotificationPage, 'Sender Name', '');

    // test the asset name is shown
    await hasText(walletNotificationPage, 'Unknown', 0, 5000, true);

    // test asset id is correct
    const assetId = calculateAssetId(MAIN_CONTRACT_ID, await getBaseAssetId());
    await hasText(walletNotificationPage, shortAddress(assetId));

    // test forward custom asset amount is correct
    await hasText(walletNotificationPage, forwardCustomAssetAmount);

    // test gas fee is correct
    await hasText(walletNotificationPage, 'Fee (network)');
    // const fee = bn.parseUnits('0.000002358');
    // await checkFee(walletNotificationPage, {
    //   minFee: fee.sub(100),
    //   maxFee: fee.add(100),
    // });

    const fuelContractId = toBech32(MAIN_CONTRACT_ID);
    await checkAddresses(
      { address: fuelWallet.address.toAddress(), isContract: false },
      { address: fuelContractId, isContract: true },
      walletNotificationPage
    );

    // Test approve
    const preDepositBalanceTkn = await fuelWallet.getBalance(assetId);
    await fuelWalletTestHelper.walletApprove();
    await waitSuccessTransaction(page);
    const postDepositBalanceTkn = await fuelWallet.getBalance(assetId);
    expect(
      Number.parseFloat(
        preDepositBalanceTkn.sub(postDepositBalanceTkn).format({ precision: 4 })
      )
    ).toBe(Number.parseFloat(forwardCustomAssetAmount));
  });
});
