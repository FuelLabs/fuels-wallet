import {
  walletSetup,
  seedWallet,
  FUEL_MNEMONIC,
} from '@fuel-wallet/test-utils';
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
  await walletSetup(context, extensionId, page, FUEL_PROVIDER_URL!);
  const fuelProvider = await Provider.create(FUEL_PROVIDER_URL!);
  const fuelWallet = Wallet.fromMnemonic(FUEL_MNEMONIC, fuelProvider);
  await seedWallet(
    fuelWallet.address.toString(),
    bn.parseUnits('100'),
    FUEL_PROVIDER_URL!,
    WALLET_SECRET!
  );
  await page.goto('/');
  return fuelWallet;
};
