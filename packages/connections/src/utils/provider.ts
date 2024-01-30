import type { Provider } from 'fuels';

export const getGasConfig = async (provider: Provider) => {
  const chain = await provider.getChain();
  const nodeInfo = await provider.fetchNode();

  return {
    gasLimit: chain.consensusParameters.maxGasPerTx.div(2),
    gasPrice: nodeInfo.minGasPrice,
    gasPriceFactor: chain.consensusParameters.gasPriceFactor,
  };
};
