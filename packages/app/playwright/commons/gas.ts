// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Provider, BN } from 'fuels';

// TODO: remove this function when SDK make transactions with correct gas configs
export const getGasConfig = async (provider: Provider) => {
  const chain = await provider.getChain();
  const nodeInfo = await provider.getNodeInfo();
  const gasLimit = chain.consensusParameters.maxGasPerTx;
  const gasPrice = nodeInfo.minGasPrice;

  return { gasLimit, gasPrice };
};
