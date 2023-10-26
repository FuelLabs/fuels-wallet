import type { BN } from 'fuels';
import { Address, BaseAssetId, Wallet, Provider } from 'fuels';

type SeedWalletOptions = {
  gasPrice?: number;
};

export async function seedWallet(
  address: string,
  amount: BN,
  fuelProviderUrl: string,
  genesisSecret: string,
  options: SeedWalletOptions = {}
) {
  const fuelProvider = await Provider.create(fuelProviderUrl);
  const { gasPriceFactor, maxGasPerTx } = await fuelProvider.getGasConfig();
  const genesisWallet = Wallet.fromPrivateKey(genesisSecret!, fuelProvider);
  const response = await genesisWallet.transfer(
    Address.fromString(address),
    amount,
    BaseAssetId,
    { gasPrice: gasPriceFactor, ...options, gasLimit: maxGasPerTx }
  );
  await response.wait();
}
