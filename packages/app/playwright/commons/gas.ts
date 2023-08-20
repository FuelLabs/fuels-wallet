import type { Provider } from 'fuels';

export const getGasConfig = async (provider: Provider) => {
  const gasLimit = (await provider.getChain()).consensusParameters.maxGasPerTx;
  const gasPrice = (await provider.getNodeInfo()).minGasPrice;

  return { gasLimit, gasPrice };
};
