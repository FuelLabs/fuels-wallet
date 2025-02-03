import { type BN, bn } from 'fuels';

export function convertToUsd(
  amount: BN,
  decimals: number,
  rate: number,
  outDecimals = 2
): number {
  if (!rate) 0;

  // biome-ignore lint/style/useExponentiationOperator: <explanation>
  const factor = Math.pow(10, outDecimals);
  const rateFixed = Math.round(rate * factor);
  const denominator = bn(10).pow(bn(decimals));
  const scaledUsdBN = amount.mul(bn(rateFixed)).div(denominator);

  // Convert the scaled value (which is in fixed-point) to a number
  // and scale it back to its true value.
  return Number(scaledUsdBN.toString()) / factor;
}
