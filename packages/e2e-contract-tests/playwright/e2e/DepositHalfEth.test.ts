import {
  test,
  getButtonByText,
  getWalletPage,
  hasText,
  walletConnect,
  walletApprove,
} from '@fuel-wallet/test-utils';
import type { WalletUnlocked } from 'fuels';
import { BaseAssetId, bn, toBech32 } from 'fuels';

import { shortAddress } from '../../src/utils';
import '../../load.envs.js';
import { testSetup } from '../utils';

import { checkAddresses, checkFee } from './utils';

const { VITE_CONTRACT_ID } = process.env;

test.describe('Deposit Half ETH', () => {
  let fuelWallet: WalletUnlocked;
  test.beforeEach(async ({ context, extensionId, page }) => {
    fuelWallet = await testSetup({ context, page, extensionId });
  });

  test('e2e deposit half eth', async ({ context, page }) => {
    const connectButton = getButtonByText(page, 'Connect');
    await connectButton.click();
    await walletConnect(context);

    const depositAmount = '1.000';
    const halfDepositAmount = '0.500';
    const depositHalfInput = page
      .getByLabel('Deposit half eth card')
      .locator('input');
    await depositHalfInput.fill(depositAmount);

    const depositHalfButton = getButtonByText(page, 'Deposit Half ETH', true);

    await page.waitForTimeout(3000);
    await depositHalfButton.click();

    const walletPage = await getWalletPage(context);

    // test forward asset name is shown
    await hasText(walletPage, 'Ethereum');
    // test forward asset id is shown
    await hasText(walletPage, shortAddress(BaseAssetId));
    // test forward eth amount is correct
    await hasText(walletPage, `${depositAmount} ETH`);

    // test return asset name is shown
    await hasText(walletPage, 'Ethereum', 1);
    // test return asset id is shown
    await hasText(walletPage, shortAddress(BaseAssetId), 1);
    // test return eth amount is correct
    await hasText(walletPage, `${halfDepositAmount} ETH`);

    // test gas fee is shown and correct
    await hasText(walletPage, 'Fee (network)');
    const fee = bn.parseUnits('0.000000152');
    await checkFee(walletPage, { minFee: fee.sub(100), maxFee: fee.add(100) });

    // test to and from addresses
    const fuelContractId = toBech32(VITE_CONTRACT_ID!);
    await checkAddresses(
      { address: fuelWallet.address.toAddress(), isContract: false },
      { address: fuelContractId, isContract: true },
      walletPage
    );
    await checkAddresses(
      { address: fuelContractId, isContract: true },
      { address: fuelWallet.address.toAddress(), isContract: false },
      walletPage
    );

    // Test approve
    await walletApprove(context);
  });
});
