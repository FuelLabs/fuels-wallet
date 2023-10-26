import type { Page } from '@playwright/test';
import type { BN } from 'fuels';
import { Address, BaseAssetId, Provider, Wallet } from 'fuels';

import { getAccount, ALT_ASSET } from '../mocks';

import { getGasConfig } from './gas';

const { GENESIS_SECRET, VITE_FUEL_PROVIDER_URL } = process.env;

export async function seedCurrentAccount(page: Page, amount: BN) {
  const account = await getAccount(page);
  await seedWallet(account.address, amount);
}

export async function seedWallet(address: string, amount: BN) {
  const provider = await Provider.create(VITE_FUEL_PROVIDER_URL);
  const genesisWallet = Wallet.fromPrivateKey(GENESIS_SECRET, provider);
  const { gasPrice, gasLimit } = await getGasConfig(genesisWallet.provider);
  const transfETH = await genesisWallet.transfer(
    Address.fromString(address),
    amount,
    BaseAssetId,
    { gasPrice, gasLimit }
  );
  await transfETH.wait();
  // eslint-disable-next-line no-console
  console.log(gasLimit);
  const transfAsset = await genesisWallet.transfer(
    Address.fromString(address),
    amount,
    ALT_ASSET.assetId,
    { gasPrice, gasLimit: 110_000 }
  );
  await transfAsset.wait();
}
