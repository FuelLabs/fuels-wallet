import { type BN, bn } from 'fuels';

const MONEY_PRECISION = 2;

function countDecimals(value: number): number {
  if (Math.floor(value) === value) return 0;

  // Really low numbers will add a scientific notation
  const str = value.toString();

  // Handle scientific notation
  if (str.includes('e-')) {
    const [nonExp, exp] = str.split('e-');
    const [, decimals] = nonExp.split('.');
    return Number(exp) + decimals.length;
  }
  return str.split('.')[1]?.length || 0;
}

function getTargetPrecision(rateDecimals: number, amountDecimals: number) {
  return Math.max(rateDecimals, amountDecimals);
}

export function convertToUsd(
  amount: BN,
  decimals: number,
  rate: number
): { value: number; formatted: string } {
  if (!rate) return { value: 0, formatted: '$0' };

  // Get the number of decimals in the rate and what's target precision.
  const rateDecimals = countDecimals(rate);
  const targetPrecision = getTargetPrecision(rateDecimals, decimals);

  // Get how many decimal places we need to apply to the rate to match the amount precision.
  // Usually the amount has more decimals than the rate, so we need to add zeros to the rate.
  const ratePrecision = Math.max(decimals - rateDecimals, 0);
  const rateUnits = bn.parseUnits(rate.toFixed(rateDecimals), rateDecimals);
  const rateFixed = rateUnits.mul(bn(10).pow(ratePrecision));

  // Get how many decimal places we need to apply to the amount to match the rate precision.
  // Sometimes the rate has more decimals than the amount, so we need to add zeros to the amount.
  const amountPrecision = Math.max(rateDecimals - decimals, 0);

  // Calculate the USD value in fixed-point: ((amount * 10^amountPrecision) * rateFixed) / 10^targetPrecision.
  const amountFixed = amount.mul(bn(10).pow(amountPrecision));
  const numerator = amountFixed.mul(bn(rateFixed));
  const denominator = bn(10).pow(bn(targetPrecision));
  const scaledUsdBN = numerator.div(denominator);

  // Use BN.format to insert the decimal point.
  const formattedUsd = scaledUsdBN.format({
    minPrecision: MONEY_PRECISION,
    precision: MONEY_PRECISION,
    units: targetPrecision,
  });

  return scaledUsdBN.isZero()
    ? { value: 0, formatted: '$0' }
    : {
        value: Number(formattedUsd.replace(/,/g, '')),
        formatted: `$${formattedUsd}`,
      };
}
