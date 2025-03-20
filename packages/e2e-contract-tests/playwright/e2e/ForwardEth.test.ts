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
    await page.waitForTimeout(1000); // Wait for slow VM
    await forwardEthButton.click();
    await page.waitForTimeout(1000); // Wait for slow VM

    const walletNotificationPage =
      await fuelWalletTestHelper.getWalletPopupPage();

    // test forward eth amount is correct
    await hasText(walletNotificationPage, `${forwardEthAmount} ETH`);
    await hasText(walletNotificationPage, 'Fee (network)');

    // test to and from addresses
    await checkAddresses(
      { address: fuelWallet.address.toString(), isContract: false },
      { address: MAIN_CONTRACT_ID, isContract: true },
      walletNotificationPage
    );

    // Test approve
    const preDepositBalanceEth = await fuelWallet.getBalance();
    await page.waitForTimeout(5000);
    await fuelWalletTestHelper.walletApprove();
    await waitSuccessTransaction(page);
    const postDepositBalanceEth = await fuelWallet.getBalance();

    const difference = preDepositBalanceEth
      .sub(postDepositBalanceEth)
      .format({ precision: 4 });

    expect(Number.parseFloat(difference)).toBe(
      Number.parseFloat(forwardEthAmount)
    );
  });
});
