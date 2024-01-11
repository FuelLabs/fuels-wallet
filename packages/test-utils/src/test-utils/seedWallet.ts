import type { BN } from 'fuels';
import { Address, BaseAssetId, Wallet, Provider, bn } from 'fuels';

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
  const { minGasPrice } = await fuelProvider.getGasConfig();
  const genesisWallet = Wallet.fromPrivateKey(genesisSecret!, fuelProvider);
  const response = await genesisWallet.transfer(
    Address.fromString(address),
    amount,
    BaseAssetId,
    { gasPrice: minGasPrice, gasLimit: bn(100_000), ...options }
  );
  await response.wait();
}
