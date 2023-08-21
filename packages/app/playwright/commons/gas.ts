import type { Provider } from 'fuels';

export const getGasConfig = async (provider: Provider) => {
  const chain = await provider.getChain();
  const nodeInfo = await provider.getNodeInfo();
  const gasLimit = chain.consensusParameters.maxGasPerTx;
  const gasPrice = nodeInfo.minGasPrice;

  return { gasLimit, gasPrice };
};
