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
    console.log('🚀 Setting up test environment...');
    ({ fuelWalletTestHelper, fuelWallet, masterWallet } = await testSetup({
      context,
      page,
      extensionId,
      amountToFund: bn.parseUnits(forwardEthAmount).mul(2),
    }));
    console.log('✅ Test setup complete');
    console.log(`📝 Test wallet address: ${fuelWallet.address.toString()}`);
    console.log(`💰 Forward ETH amount: ${forwardEthAmount} ETH`);
  });

  test.afterEach(async () => {
    console.log(
      '🧹 Cleaning up - transferring balance back to master wallet...'
    );
    await transferMaxBalance({
      fromWallet: fuelWallet,
      toWallet: masterWallet,
    });
    console.log('✅ Cleanup complete');
  });

  test('e2e forward ETH', async ({ page }) => {
    console.log('🔌 Connecting to wallet...');
    await connect(page, fuelWalletTestHelper);
    console.log('✅ Wallet connected');

    console.log('💸 Filling forward ETH amount...');
    const forwardEthInput = page
      .getByLabel('Forward eth card')
      .getByRole('textbox');
    await forwardEthInput.fill(forwardEthAmount);
    console.log(`✅ Amount filled: ${forwardEthAmount} ETH`);

    console.log('🔘 Clicking Forward ETH button...');
    const forwardEthButton = getButtonByText(page, 'Forward ETH');
    await expectButtonToBeEnabled(forwardEthButton);
    await forwardEthButton.click();
    console.log('✅ Forward ETH button clicked');

    console.log('⏳ Waiting for VM...');
    await page.waitForTimeout(10000);
    console.log('✅ VM wait complete');

    console.log('🔍 Getting wallet notification page...');
    const walletNotificationPage =
      await fuelWalletTestHelper.getWalletPopupPage();
    console.log('✅ Wallet notification page ready');

    console.log('🔍 Checking asset details...');
    checkAriaLabelsContainsText(
      walletNotificationPage,
      'Asset Name',
      'Ethereum'
    );
    checkAriaLabelsContainsText(walletNotificationPage, 'Sender Name', '');
    await hasText(walletNotificationPage, 'Ethereum');

    console.log('🔍 Checking asset ID...');
    const baseAssetId = await getBaseAssetId();
    await hasText(walletNotificationPage, shortAddress(baseAssetId));
    console.log(`✅ Asset ID verified: ${shortAddress(baseAssetId)}`);

    console.log('🔍 Checking transaction details...');
    await hasText(walletNotificationPage, `${forwardEthAmount} ETH`);
    await hasText(walletNotificationPage, 'Fee (network)');

    console.log('🔍 Verifying addresses...');
    await checkAddresses(
      { address: fuelWallet.address.toString(), isContract: false },
      { address: MAIN_CONTRACT_ID, isContract: true },
      walletNotificationPage
    );
    console.log('✅ Addresses verified');

    console.log('💰 Getting pre-deposit balance...');
    const preDepositBalanceEth = await fuelWallet.getBalance();
    console.log(`Pre-deposit balance: ${preDepositBalanceEth.format()}`);

    console.log('👆 Approving transaction...');
    await fuelWalletTestHelper.walletApprove();
    await waitSuccessTransaction(page);
    console.log('✅ Transaction approved');

    console.log('💰 Getting post-deposit balance...');
    const postDepositBalanceEth = await fuelWallet.getBalance();
    console.log(`Post-deposit balance: ${postDepositBalanceEth.format()}`);

    const difference = preDepositBalanceEth
      .sub(postDepositBalanceEth)
      .format({ precision: 4 });
    console.log(`Balance difference: ${difference} ETH`);

    expect(Number.parseFloat(difference)).toBe(
      Number.parseFloat(forwardEthAmount)
    );
    console.log('✅ Test completed successfully');
  });
});
