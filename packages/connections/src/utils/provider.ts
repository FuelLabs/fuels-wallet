import type { Provider } from 'fuels';

export const getGasConfig = async (provider: Provider) => {
  const chain = await provider.getChain();
  const gasPrice = await provider.getLatestGasPrice();

  return {
    gasLimit: chain.consensusParameters.maxGasPerTx.div(2),
    gasPrice,
    gasPriceFactor: chain.consensusParameters.gasPriceFactor,
  };
};
