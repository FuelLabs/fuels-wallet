import type { Page } from '@playwright/test';
import type { BN } from 'fuels';
import { Address, BaseAssetId, Wallet } from 'fuels';

import { getAccount, ALT_ASSET } from '../mocks';

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
  const transfETH = await genesisWallet.transfer(
    Address.fromString(address),
    amount,
    BaseAssetId,
    { gasPrice: 1 }
  );
  await transfETH.wait();
  const transfAsset = await genesisWallet.transfer(
    Address.fromString(address),
    amount,
    ALT_ASSET.assetId,
    { gasPrice: 1 }
  );
  await transfAsset.wait();
}
