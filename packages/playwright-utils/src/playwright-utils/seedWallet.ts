import type { BN, TxParamsType } from 'fuels';
import { Address, Provider, Wallet, bn } from 'fuels';

export async function seedWallet(
  address: string,
  amount: BN,
  fuelProviderUrl: string,
  genesisSecret: string,
  options: TxParamsType = {}
) {
  const fuelProvider = await Provider.create(fuelProviderUrl);
  const baseAssetId = fuelProvider.getBaseAssetId();
  const genesisWallet = Wallet.fromPrivateKey(genesisSecret!, fuelProvider);
  const parameters: TxParamsType = { gasLimit: bn(100_000), ...options };
  const response = await genesisWallet.transfer(
    Address.fromString(address),
    amount,
    baseAssetId,
    parameters
  );
  await response.wait();
}
