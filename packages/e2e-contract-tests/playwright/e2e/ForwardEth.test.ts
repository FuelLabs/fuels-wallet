import {
  test,
  getButtonByText,
  walletConnect,
  getWalletPage,
  hasText,
  walletApprove,
} from '@fuel-wallet/test-utils';
import { expect } from '@playwright/test';
import { BaseAssetId, bn, toBech32 } from 'fuels';
import type { WalletUnlocked } from 'fuels';

import '../../load.envs';
import { shortAddress } from '../../src/utils';
import { testSetup } from '../utils';

import { checkFee, checkAddresses } from './utils';

const { VITE_CONTRACT_ID } = process.env;

test.describe('Forward Eth', () => {
  let fuelWallet: WalletUnlocked;
  test.beforeEach(async ({ context, extensionId, page }) => {
    fuelWallet = await testSetup({ context, page, extensionId });
  });

  test('e2e forward ETH', async ({ context, page }) => {
    const connectButton = getButtonByText(page, 'Connect');
    await connectButton.click();
    await walletConnect(context);

    const forwardEthAmount = '1.2345';
    const forwardEthInput = page
      .getByLabel('Forward eth card')
      .locator('input');
    await forwardEthInput.fill(forwardEthAmount);

    const forwardEthButton = getButtonByText(page, 'Forward ETH');
    await page.waitForTimeout(2500);
    await forwardEthButton.click();

    const walletPage = await getWalletPage(context);

    // test the asset name is shown
    await hasText(walletPage, 'Ethereum');

    // test asset id is correct
    await hasText(walletPage, shortAddress(BaseAssetId));

    // test forward eth amount is correct
    await hasText(walletPage, `${forwardEthAmount} ETH`);

    // test gas fee is correct
    await hasText(walletPage, 'Fee (network)');
    const fee = bn.parseUnits('0.000000114');
    await checkFee(walletPage, { minFee: fee.sub(100), maxFee: fee.add(100) });

    // test to and from addresses
    const fuelContractId = toBech32(VITE_CONTRACT_ID!);
    await checkAddresses(
      { address: fuelWallet.address.toAddress(), isContract: false },
      { address: fuelContractId, isContract: true },
      walletPage
    );

    // Test approve
    const preDepositBalanceEth = await fuelWallet.getBalance();
    await walletApprove(context);
    await hasText(page, 'Transaction successful.');
    const postDepositBalanceEth = await fuelWallet.getBalance();
    expect(
      parseFloat(
        preDepositBalanceEth
          .sub(postDepositBalanceEth)
          .format({ precision: 6, units: 9 })
      )
    ).toBe(parseFloat(forwardEthAmount));
  });
});
