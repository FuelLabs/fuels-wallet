import type { FuelWalletTestHelper } from '@fuels/playwright-utils';
import {
  expectButtonToBeEnabled,
  getButtonByText,
  hasText,
} from '@fuels/playwright-utils';
import { expect } from '@playwright/test';
import { bn } from 'fuels';
import type { WalletUnlocked } from 'fuels';

import '../../load.envs';
import { getBaseAssetId, shortAddress } from '../../src/utils';
import { testSetup, transferMaxBalance } from '../utils';

import { MAIN_CONTRACT_ID } from './config';
import { test, useLocalCRX } from './test';
import {
  checkAddresses,
  checkAriaLabelsContainsText,
  connect,
  waitSuccessTransaction,
} from './utils';

useLocalCRX();

test.describe('Forward Eth', () => {
  let fuelWalletTestHelper: FuelWalletTestHelper;
  let fuelWallet: WalletUnlocked;
  let masterWallet: WalletUnlocked;

  const forwardEthAmount = '0.0012';

  test.beforeEach(async ({ context, extensionId, page }) => {
    ({ fuelWalletTestHelper, fuelWallet, masterWallet } = await testSetup({
      context,
      page,
      extensionId,
      amountToFund: bn.parseUnits(forwardEthAmount).mul(2),
    }));
  });

  test.afterEach(async () => {
    await transferMaxBalance({
      fromWallet: fuelWallet,
      toWallet: masterWallet,
    });
  });

  test('e2e forward ETH', async ({ page }) => {
    await connect(page, fuelWalletTestHelper);

    const forwardEthInput = page
      .getByLabel('Forward eth card')
      .getByRole('textbox');
    await forwardEthInput.fill(forwardEthAmount);

    const forwardEthButton = getButtonByText(page, 'Forward ETH');
    await expectButtonToBeEnabled(forwardEthButton);
    await forwardEthButton.click();

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
    await hasText(walletNotificationPage, 'Ethereum');

    // test asset id is correct
    await hasText(walletNotificationPage, shortAddress(await getBaseAssetId()));

    // test forward eth amount is correct
    await hasText(walletNotificationPage, `${forwardEthAmount} ETH`);

    // test gas fee is correct
    await hasText(walletNotificationPage, 'Fee (network)');

    // test to and from addresses
    await checkAddresses(
      { address: fuelWallet.address.toString(), isContract: false },
      { address: MAIN_CONTRACT_ID, isContract: true },
      walletNotificationPage
    );

    // Test approve
    const preDepositBalanceEth = await fuelWallet.getBalance();
    await fuelWalletTestHelper.walletApprove();
    await waitSuccessTransaction(page);
    const postDepositBalanceEth = await fuelWallet.getBalance();
    expect(
      Number.parseFloat(
        preDepositBalanceEth.sub(postDepositBalanceEth).format({ precision: 4 })
      )
    ).toBe(Number.parseFloat(forwardEthAmount));
  });
});
