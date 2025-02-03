import { type BN, bn } from 'fuels';

const DEFAULT_MIN_PRECISION = 2;
const EXTRA_PRECISION_DIGITS = 10;

export function convertToUsd(
  amount: BN,
  decimals: number,
  rate: number
): { value: number; formatted: string } {
  if (!rate) return { value: 0, formatted: '$0' };

  // Use a higher extra precision multiplier to preserve small fractions.
  const extraPrecision = 10 ** EXTRA_PRECISION_DIGITS;
  // This is used for the fixed output decimals.
  const outFactor = 10 ** DEFAULT_MIN_PRECISION;

  // Scale the rate to fixed-point.
  const rateFixed = Math.round(rate * outFactor);

  // Multiply the numerator by the extra precision factor to avoid truncation.
  // Numerator represents: amount * rateFixed * extraPrecision.
  const numerator = amount.mul(bn(rateFixed)).mul(bn(extraPrecision));
  const denominator = bn(10).pow(bn(decimals));
  const scaledUsdBN = numerator.div(denominator);

  // scaledUsdBN now represents the value multiplied by (extraPrecision * outFactor)
  // Recover the actual value by dividing by that factor.
  const value = Number(scaledUsdBN.toString()) / (extraPrecision * outFactor);

  if (value === 0) return { value, formatted: '$0' };

  let formatted: string;
  if (value >= 0.01) {
    // For values >= 0.01, always show exactly two decimal places.
    formatted = value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else {
    // For values < 0.01, show until the first nonzero digit (but at least 2 decimals)
    const fixedStr = value.toFixed(9);
    const [intPart, fracPart] = fixedStr.split('.');
    let cutOffIndex = 0;
    for (let i = 0; i < fracPart.length; i++) {
      if (fracPart[i] !== '0') {
        cutOffIndex = i + 1;
        break;
      }
    }
    if (cutOffIndex < 2) cutOffIndex = 2;
    formatted = `${intPart}.${fracPart.slice(0, cutOffIndex)}`;
  }
  return { value, formatted: `$${formatted}` };
}
