import type { BN } from 'fuels';
import { Address, BaseAssetId, Wallet, Provider } from 'fuels';

const { GENESIS_SECRET, FUEL_PROVIDER_URL } = process.env;

type SeedWalletOptions = {
  gasPrice?: number;
};

export async function seedWallet(
  address: string,
  amount: BN,
  options: SeedWalletOptions = {}
) {
  const fuelProvider = await Provider.create(FUEL_PROVIDER_URL!);
  const genesisWallet = Wallet.fromPrivateKey(GENESIS_SECRET!, fuelProvider);
  const response = await genesisWallet.transfer(
    Address.fromString(address),
    amount,
    BaseAssetId,
    { gasPrice: 1, ...options }
  );
  await response.wait();
}
