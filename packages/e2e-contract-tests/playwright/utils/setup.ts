import {
  seedWallet,
  FUEL_MNEMONIC,
  FuelWalletTestHelper,
} from '@fuels/playwright-utils';
import type { BrowserContext, Page } from '@playwright/test';
import { bn, Wallet, Provider } from 'fuels';

import '../../load.envs';

const { FUEL_PROVIDER_URL, WALLET_SECRET } = process.env;

export const testSetup = async ({
  context,
  extensionId,
  page,
}: {
  context: BrowserContext;
  page: Page;
  extensionId: string;
}) => {
  const fuelProvider = await Provider.create(FUEL_PROVIDER_URL!);
  const chainName = (await fuelProvider.fetchChain()).name;
  const fuelWalletTestHelper = await FuelWalletTestHelper.walletSetup(
    context,
    extensionId,
    fuelProvider.url,
    chainName
  );
  const fuelWallet = Wallet.fromMnemonic(FUEL_MNEMONIC);
  await seedWallet(
    fuelWallet.address.toString(),
    bn.parseUnits('100'),
    FUEL_PROVIDER_URL!,
    WALLET_SECRET!
  );
  await page.goto('/');
  return { fuelWallet, fuelWalletTestHelper };
};
