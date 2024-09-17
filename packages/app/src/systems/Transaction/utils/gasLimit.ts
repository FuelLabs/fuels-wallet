import type { BN } from 'fuels';

export const formatGasLimit = (value: BN) => {
  const hex = value.toHex();
  const gasLimit = BigInt(hex);

  return gasLimit.toLocaleString('en-US');
};
