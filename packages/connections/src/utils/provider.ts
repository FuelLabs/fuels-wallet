import type { Provider } from 'fuels';

export const getGasConfig = async (provider: Provider) => {
  const chain = await provider.getChain();
  const gasPrice = await provider.getLatestGasPrice();
  const txParameters = chain.consensusParameters.txParameters;
  const feeParameters = chain.consensusParameters.feeParameters;

  return {
    gasLimit: txParameters.maxGasPerTx.div(2),
    gasPrice,
    gasPriceFactor: feeParameters.gasPriceFactor,
  };
};
