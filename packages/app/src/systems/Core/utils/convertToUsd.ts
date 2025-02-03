import { type BN, bn } from 'fuels';

const DEFAULT_MIN_PRECISION = 2;

export function convertToUsd(
  amount: BN,
  decimals: number,
  rate: number
): { value: number; formatted: string } {
  if (!rate) return { value: 0, formatted: '$0' };

  const precisionFactor = 10 ** DEFAULT_MIN_PRECISION;

  // Used for the output fixed-point
  const outFactor = 10 ** DEFAULT_MIN_PRECISION;

  // Scaled rate. Instead of rate * outFactor (which is what we did before), we use an extra multiplier to keep the fractional part.
  // Since BN handles numbers as integers, we need to round the result to avoid losing precision on smaller values.
  const rateFixed = Math.round(rate * outFactor);

  // We multiply the numerator by an extra precision factor in order to not lose the fractional part during division
  // Our intended fixed-point integer `(representing value * (precisionFactor * outFactor))` is (amount * rateFixed * precisionFactor) / (10^decimals)
  // Essentially ` (amount/10^decimals) * rate ` but in fixed-point arithmetic.
  // And then we recover the actual value by dividing by (precisionFactor * outFactor).
  const numerator = amount.mul(bn(rateFixed)).mul(bn(precisionFactor));
  const denominator = bn(10).pow(bn(decimals));
  const scaledUsdBN = numerator.div(denominator);

  // Convert to a number:
  // Here scaledUsdBN represents value * (precisionFactor * outFactor)
  // so we must divide by (precisionFactor * outFactor) to get the actual value.
  const value = Number(scaledUsdBN.toString()) / (precisionFactor * outFactor);

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
