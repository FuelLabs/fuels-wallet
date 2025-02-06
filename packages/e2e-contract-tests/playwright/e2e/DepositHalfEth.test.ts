import {
  expectButtonToBeEnabled,
  getButtonByText,
  hasText,
} from '@fuels/playwright-utils';
import type { FuelWalletTestHelper } from '@fuels/playwright-utils';
import { expect } from '@playwright/test';
import type { WalletUnlocked } from 'fuels';
import { bn } from 'fuels';

import '../../load.envs.js';
import { testSetup, transferMaxBalance } from '../utils';

import { test, useLocalCRX } from './test';
import { connect, waitSuccessTransaction } from './utils';

useLocalCRX();

test.describe('Deposit Half ETH', () => {
  let fuelWalletTestHelper: FuelWalletTestHelper;
  let fuelWallet: WalletUnlocked;
  let masterWallet: WalletUnlocked;

  const depositAmount = '0.010';
  const halfDepositAmount = '0.005';

  test.beforeEach(async ({ context, extensionId, page }) => {
    ({ fuelWalletTestHelper, fuelWallet, masterWallet } = await testSetup({
      context,
      page,
      extensionId,
      amountToFund: bn.parseUnits(depositAmount).mul(2),
    }));
  });

  test.afterEach(async () => {
    await transferMaxBalance({
      fromWallet: fuelWallet,
      toWallet: masterWallet,
    });
  });

  test('e2e deposit half eth', async ({ page }) => {
    await connect(page, fuelWalletTestHelper);

    const depositHalfInput = page
      .getByLabel('Deposit half eth card')
      .getByRole('textbox');
    await depositHalfInput.fill(depositAmount);

    const depositHalfButton = getButtonByText(page, 'Deposit Half ETH', true);
    await expectButtonToBeEnabled(depositHalfButton);
    await page.waitForTimeout(1000);
    await depositHalfButton.click();
    await page.waitForTimeout(1000);

    const walletNotificationPage =
      await fuelWalletTestHelper.getWalletPopupPage();

    await hasText(walletNotificationPage, `${depositAmount} ETH`);

    await hasText(walletNotificationPage, `${halfDepositAmount} ETH`);

    await hasText(walletNotificationPage, 'Fee (network)');

    const preDepositBalanceEth = await fuelWallet.getBalance();

    await fuelWalletTestHelper.walletApprove();
    await waitSuccessTransaction(page);
    const postDepositBalanceEth = await fuelWallet.getBalance();

    expect(
      Number.parseFloat(
        preDepositBalanceEth.sub(postDepositBalanceEth).format({ precision: 3 })
      )
    ).toBe(Number.parseFloat(halfDepositAmount));
  });
});
