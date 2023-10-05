import type { BN } from 'fuels';
import { BaseAssetId, Address, Wallet, Provider } from 'fuels';

export const getGasConfig = async (provider: Provider) => {
  const chain = await provider.getChain();
  const nodeInfo = await provider.fetchNode();

  return {
    gasLimit: chain.consensusParameters.maxGasPerTx,
    gasPrice: nodeInfo.minGasPrice,
    gasPriceFactor: chain.consensusParameters.gasPriceFactor,
  };
};

export async function seedWallet(address: string, amount: BN) {
  const provider = await Provider.create(process.env.PUBLIC_PROVIDER_URL!);
  const genesisWallet = Wallet.fromPrivateKey(
    process.env.PUBLIC_GENESIS_SECRET!,
    provider
  );
  const { gasLimit, gasPrice } = await getGasConfig(genesisWallet.provider);
  const response = await genesisWallet.transfer(
    Address.fromString(address),
    amount,
    BaseAssetId,
    { gasLimit, gasPrice }
  );
  await response.wait();
}
