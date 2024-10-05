import { type BN, type TransactionRequest, bn } from 'fuels';

export const formatGasLimit = (value: BN) => {
  const hex = value.toHex();
  const gasLimit = BigInt(hex);

  return gasLimit.toLocaleString('en-US');
};

export const getGasLimitFromTxRequest = (txRequest?: TransactionRequest) => {
  if (!txRequest || !('gasLimit' in txRequest)) return bn(0);

  return txRequest.gasLimit;
};
export const setGasLimitToTxRequest = (
  txRequest?: TransactionRequest,
  gasLimit?: BN
) => {
  if (!txRequest || !('gasLimit' in txRequest) || !gasLimit) return undefined;

  txRequest.gasLimit = gasLimit;
};
