import {
  test,
  getButtonByText,
  getWalletPage,
  hasText,
  walletConnect,
  walletApprove,
} from '@fuel-wallet/test-utils';
import { expect } from '@playwright/test';
import { BaseAssetId, bn, toBech32 } from 'fuels';
import type { WalletUnlocked } from 'fuels';

import { shortAddress, calculateAssetId } from '../../src/utils';
import '../../load.envs.js';
import { testSetup } from '../utils';

import { checkFee, checkAddresses } from './utils';

const { VITE_CONTRACT_ID, VITE_EXTERNAL_CONTRACT_ID } = process.env;

test.describe('Forward Half ETH and Mint External Custom Asset', () => {
  let fuelWallet: WalletUnlocked;
  test.beforeEach(async ({ context, extensionId, page }) => {
    fuelWallet = await testSetup({ context, page, extensionId });
  });

  test('e2e foreward half eth and mint external custom asset', async ({
    context,
    page,
  }) => {
    const connectButton = getButtonByText(page, 'Connect');
    await connectButton.click();
    await walletConnect(context);

    const depositAmount = '1.000';
    const halfDepositAmount = '0.500';
    const depositHalfInput = page.getByLabel('Forward amount external mint');
    await depositHalfInput.fill(depositAmount);

    const mintAmount = '1.2345';
    const mintInput = page.getByLabel('Mint amount external mint');
    await mintInput.fill(mintAmount);

    const forwardHalfAndMintButton = getButtonByText(
      page,
      'Forward Half And External Mint'
    );
    await forwardHalfAndMintButton.click();

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

    // test mint asset name is shown
    await hasText(walletPage, 'Unknown', 0, 5000, true);
    // test mint asset id is shown
    const assetId = calculateAssetId(VITE_EXTERNAL_CONTRACT_ID!, BaseAssetId);
    await hasText(walletPage, shortAddress(assetId));
    // test mint amount is correct
    await hasText(walletPage, mintAmount);

    // test gas fee is shown and correct
    await hasText(walletPage, 'Fee (network)');
    const fee = bn.parseUnits('0.000000233');
    await checkFee(walletPage, { minFee: fee.sub(100), maxFee: fee.add(100) });

    const fuelContractId = toBech32(VITE_CONTRACT_ID!);
    await checkAddresses(
      { address: fuelWallet.address.toAddress(), isContract: false },
      { address: fuelContractId, isContract: true },
      walletPage
    );
    await checkAddresses(
      { address: fuelWallet.address.toAddress(), isContract: false },
      { address: toBech32(VITE_EXTERNAL_CONTRACT_ID!), isContract: true },
      walletPage,
      1,
      1
    );
    await checkAddresses(
      { address: fuelContractId, isContract: true },
      { address: fuelWallet.address.toAddress(), isContract: false },
      walletPage
    );

    // Test approve
    const preDepositBalanceEth = await fuelWallet.getBalance();
    const preDepositBalanceTkn = await fuelWallet.getBalance(assetId);
    await walletApprove(context);
    await hasText(page, 'Transaction successful.');
    const postDepositBalanceEth = await fuelWallet.getBalance();
    const postDepositBalanceTkn = await fuelWallet.getBalance(assetId);
    expect(
      parseFloat(
        preDepositBalanceEth
          .sub(postDepositBalanceEth)
          .format({ precision: 6, units: 9 })
      )
    ).toBe(parseFloat(halfDepositAmount));
    expect(
      parseFloat(
        postDepositBalanceTkn
          .sub(preDepositBalanceTkn)
          .format({ precision: 6, units: 9 })
      )
    ).toBe(parseFloat(mintAmount));
  });
});
