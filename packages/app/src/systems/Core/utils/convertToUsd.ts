import { type BN, bn } from 'fuels';

const DEFAULT_MIN_PRECISION = 2;
const EXTRA_PRECISION_DIGITS = 10;
const EXTRA_PRECISION = bn(10).pow(bn(EXTRA_PRECISION_DIGITS));
const OUT_FACTOR = 10 ** DEFAULT_MIN_PRECISION; // e.g. 100 for 2 decimals

export function convertToUsd(
  amount: BN,
  decimals: number,
  rate: number
): { value: number; formatted: string } {
  if (!rate) return { value: 0, formatted: '$0' };

  // Convert the rate to a fixed-point integer.
  const rateFixed = Math.round(rate * OUT_FACTOR);

  // Calculate the USD value in fixed-point: (amount * rateFixed * EXTRA_PRECISION) / 10^decimals.
  const numerator = amount.mul(bn(rateFixed)).mul(EXTRA_PRECISION);
  const denominator = bn(10).pow(bn(decimals));
  const scaledUsdBN = numerator.div(denominator);

  // The BN is scaled by EXTRA_PRECISION * OUT_FACTOR, so its total decimal places is:
  const totalScaleDigits = EXTRA_PRECISION_DIGITS + DEFAULT_MIN_PRECISION;

  // Use BN.format to insert the decimal point.
  const formattedUsd = scaledUsdBN.format({
    minPrecision: DEFAULT_MIN_PRECISION,
    precision: DEFAULT_MIN_PRECISION,
    units: totalScaleDigits,
  });

  return scaledUsdBN.isZero()
    ? { value: 0, formatted: '$0' }
    : {
        value: Number(formattedUsd.replace(/,/g, '')),
        formatted: `$${formattedUsd}`,
      };
}
