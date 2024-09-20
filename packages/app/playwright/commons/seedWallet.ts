import type { Page } from '@playwright/test';
import type { BN } from 'fuels';
import { Address, Provider, Wallet } from 'fuels';

import { ALT_ASSET, getAccount } from '../mocks';

const { GENESIS_SECRET, VITE_FUEL_PROVIDER_URL } = process.env;

export async function seedCurrentAccount(page: Page, amount: BN) {
  const account = await getAccount(page);
  await seedWallet(account.address, amount);
}

export async function seedWallet(address: string, amount: BN) {
  const provider = await Provider.create(VITE_FUEL_PROVIDER_URL);
  const genesisWallet = Wallet.fromPrivateKey(GENESIS_SECRET, provider);

  const transfETH = await genesisWallet.transfer(
    Address.fromString(address),
    amount,
    provider.getBaseAssetId()
  );
  await transfETH.wait();

  const transfAsset = await genesisWallet.transfer(
    Address.fromString(address),
    amount,
    ALT_ASSET.networks[0].assetId
  );
  await transfAsset.wait();
}
