import type { Page } from '@playwright/test';
import type { BN } from 'fuels';
import { Address, NativeAssetId, Wallet } from 'fuels';

import { getAccount } from '../mocks';

const { GENESIS_SECRET, VITE_FUEL_PROVIDER_URL } = process.env;

export async function seedCurretAccount(page: Page, amount: BN) {
  const account = await getAccount(page);
  await seedWallet(account.address, amount);
}

export async function seedWallet(address: string, amount: BN) {
  const genesisWallet = Wallet.fromPrivateKey(
    GENESIS_SECRET,
    VITE_FUEL_PROVIDER_URL
  );
  const response = await genesisWallet.transfer(
    Address.fromString(address),
    amount,
    NativeAssetId,
    { gasPrice: 1 }
  );
  await response.wait();
}
