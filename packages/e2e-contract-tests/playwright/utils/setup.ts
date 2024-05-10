import {
  FUEL_MNEMONIC,
  FuelWalletTestHelper,
  seedWallet,
} from '@fuels/playwright-utils';
import type { BrowserContext, Page } from '@playwright/test';
import { Provider, Wallet, bn } from 'fuels';

import '../../load.envs';

const { VITE_FUEL_PROVIDER_URL, VITE_WALLET_SECRET } = process.env;

export const testSetup = async ({
  context,
  extensionId,
  page,
}: {
  context: BrowserContext;
  page: Page;
  extensionId: string;
}) => {
  const fuelProvider = await Provider.create(VITE_FUEL_PROVIDER_URL!);
  const chainName = (await fuelProvider.fetchChain()).name;
  const fuelWalletTestHelper = await FuelWalletTestHelper.walletSetup(
    context,
    extensionId,
    fuelProvider.url,
    chainName
  );
  const fuelWallet = Wallet.fromMnemonic(FUEL_MNEMONIC);
  fuelWallet.connect(fuelProvider);
  await seedWallet(
    fuelWallet.address.toString(),
    bn.parseUnits('100'),
    VITE_FUEL_PROVIDER_URL!,
    VITE_WALLET_SECRET!
  );
  await page.goto('/');
  return { fuelWallet, fuelWalletTestHelper };
};
