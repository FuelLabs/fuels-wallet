import { type BN, bn } from 'fuels';

export function convertToUsd(
  amount: BN,
  decimals: number,
  rate: number,
  outDecimals = 2
): { value: number; formatted: string } {
  if (!rate) return { value: 0, formatted: '$0' };

  // Multiply the rate by 10^(outDecimals) to convert it into a fixed-point integer.
  // biome-ignore lint/style/useExponentiationOperator: <explanation>
  const factor = Math.pow(10, outDecimals);
  const rateFixed = Math.round(rate * factor);

  // Compute the denominator (10^decimals)
  const denominator = bn(10).pow(bn(decimals));

  // Calculate scaled USD value as an integer (fixed-point style)
  const scaledUsdBN = amount.mul(bn(rateFixed)).div(denominator);

  // Convert the scaled result back to its true floating-point value.
  const value = Number(scaledUsdBN.toString()) / factor;

  if (value === 0) return { value, formatted: '$0' };

  const formatted = value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 9,
  });

  return { value, formatted: `$${formatted}` };
}
