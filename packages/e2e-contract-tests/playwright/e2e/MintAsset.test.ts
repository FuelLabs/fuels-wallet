import {
  test,
  getButtonByText,
  getWalletPage,
  hasText,
  walletConnect,
  addAssetThroughSettings,
} from '@fuel-wallet/test-utils';
import { bn, toBech32 } from 'fuels';

import { shortAddress, calculateAssetId } from '../../src/utils';
import '../../load.envs.js';
import { testSetup } from '../utils';

import { checkFee, checkAddresses } from './utils';

const { VITE_CONTRACT_ID } = process.env;

test.describe('Mint Assets', () => {
  let fuelWallet;
  test.beforeEach(async ({ context, extensionId, page }) => {
    fuelWallet = await testSetup({ context, page, extensionId });
  });

  test('e2e mint unknown assets', async ({ context, page }) => {
    const connectButton = getButtonByText(page, 'Connect');
    await connectButton.click();
    await walletConnect(context);

    const mintAmount = '1.2345';
    const mintInput = page.getByLabel('Mint asset card').locator('input');
    await mintInput.fill(mintAmount);

    const mintButton = getButtonByText(page, 'Mint', true);
    await page.waitForTimeout(3000);
    await mintButton.click();

    // test asset is correct
    const assetId = calculateAssetId(process.env.VITE_CONTRACT_ID!);
    const walletPage = await getWalletPage(context);
    // short address function copied from app package
    await hasText(walletPage, shortAddress(assetId), 0, 10000);

    // test mint amount is correct
    await hasText(walletPage, mintAmount);

    // test gas fee is shown and correct
    await hasText(walletPage, 'Fee (network)');
    const fee = bn.parseUnits('0.00000013');
    await checkFee(walletPage, { minFee: fee.sub(100), maxFee: fee.add(100) });

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
  });

  test('e2e mint known asset', async ({ context, page }) => {
    const connectButton = getButtonByText(page, 'Connect');
    await connectButton.click();
    await walletConnect(context);

    const subId =
      '0x0000000000000000000000000000000000000000000000000000000000000001';
    const name = 'Token';
    const symbol = 'TKN';
    const decimals = '6';
    const assetId = calculateAssetId(process.env.VITE_CONTRACT_ID!, subId);

    await addAssetThroughSettings(
      context,
      assetId,
      name,
      symbol,
      Number(decimals)
    );

    const mintAmount = '1.2345';
    const mintAmountInput = page.getByLabel('Asset config amount');
    await mintAmountInput.fill(mintAmount);

    const subIdInput = page.getByLabel('Asset config subid');
    await subIdInput.fill(subId);

    const decimalsInput = page.getByLabel('Asset config decimals');
    await decimalsInput.fill(decimals);

    const mintButton = getButtonByText(page, 'Mint Asset configuration');
    await page.waitForTimeout(3000);
    await mintButton.click();

    // test asset is correct
    const walletPage = await getWalletPage(context);

    await hasText(walletPage, name);
    await hasText(walletPage, shortAddress(assetId), 0, 10000);
    // test mint amount is correct
    await hasText(walletPage, `1.2345 ${symbol}`);

    // test gas fee is shown and correct
    await hasText(walletPage, 'Fee (network)');
    const fee = bn.parseUnits('0.000000133');
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
  });
});
