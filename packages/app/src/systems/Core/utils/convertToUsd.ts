import { type BN, bn } from 'fuels';
import { INTL_FORMATTER } from '~/systems/Asset/constants';

export function convertToUsd(
  amount: BN,
  decimals: number,
  rate: number,
  outDecimals = 2
): { value: number; formatted: string } {
  if (!rate) return { value: 0, formatted: '$0.00' };

  // biome-ignore lint/style/useExponentiationOperator: <explanation>
  const factor = Math.pow(10, outDecimals);
  const rateFixed = Math.round(rate * factor);
  const denominator = bn(10).pow(bn(decimals));
  const scaledUsdBN = amount.mul(bn(rateFixed)).div(denominator);

  // Convert the scaled value (which is in fixed-point) to a number
  // and scale it back to its true value.
  const result = Number(scaledUsdBN.toString()) / factor;
  const formatted =
    result > 0.01 ? INTL_FORMATTER.format(result) : `$${result.toString(10)}`;
  return { value: result, formatted };
}
