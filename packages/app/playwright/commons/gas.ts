import type { BN, Provider } from 'fuels';

// TODO: remove this function when SDK make transactions with correct gas configs
export const getGasConfig = async (provider: Provider) => {
  const chain = await provider.getChain();
  const nodeInfo = await provider.fetchNode();
  const gasLimit = chain.consensusParameters.maxGasPerTx.div(2);
  const gasPrice = nodeInfo.minGasPrice;

  return { gasLimit, gasPrice };
};
