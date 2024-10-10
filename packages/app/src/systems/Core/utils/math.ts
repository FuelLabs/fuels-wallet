import type { BN, BNInput, FormatConfig } from 'fuels';
import { DECIMAL_FUEL, bn } from 'fuels';
import { MAX_FRACTION_DIGITS } from '~/config';

const MINIMUM_ZEROS_TO_DISPLAY = 5; // it means 0.000001 (at least 5 zeros in decimals)
const PRECISION = 6;

export type FormatBalanceResult = {
  amount: BN;
  formatted: {
    display: string;
    fractionDigits: number;
  };
  original: {
    display: string;
    fractionDigits: number;
  };
};

// this function replaces native bn.format because it fails when it's 0 units
// put link to ts-sdk issue here
export function formatAmount({
  amount,
  options,
}: { amount?: BNInput; options?: FormatConfig }) {
  const formatParams = {
    precision: MAX_FRACTION_DIGITS,
    ...(options ?? {}),
  };

  const isZeroUnits = !options?.units;
  // covers a bug in the sdk that format don't work when unit is zero. we'll use 1 instead, then multiply by 10 later
  if (isZeroUnits) {
    // we'll multiply by 10, then can reduce 1 unit later, resulting in same zero units
    const amountZeroUnits = bn(amount).mul(10);
    formatParams.units = 1;
    formatParams.precision = 0;
    return amountZeroUnits.format(formatParams);
  }

  return bn(amount).format(formatParams);
}

export const formatBalance = (
  input: BNInput | null | undefined = '0',
  units: number | undefined = DECIMAL_FUEL
): FormatBalanceResult => {
  const amount = bn(input);
  const minimum = bn('1'.padEnd(units - MINIMUM_ZEROS_TO_DISPLAY, '0'));

  if (amount.isZero()) {
    return {
      amount,
      formatted: {
        display: '0',
        fractionDigits: 0,
      },
      original: {
        display: '0',
        fractionDigits: 0,
      },
    };
  }

  // Format the original amount, example "0.000000000002409883". Good to use in tooltips.
  // But in UIs, it may break the layout, so we need to display only the "formatted" there.
  const originalDisplay = amount.format({
    units: units,
    precision: units,
  });

  if (minimum.gt(amount)) {
    return {
      amount,
      formatted: {
        display: `<${minimum.format({
          units: units,
          precision: PRECISION,
        })}`,
        fractionDigits: PRECISION,
      },
      original: {
        display: originalDisplay,
        fractionDigits: units,
      },
    };
  }

  return {
    amount,
    formatted: {
      display: amount.format({
        units: units,
        precision: PRECISION,
      }),
      fractionDigits: PRECISION,
    },
    original: {
      display: originalDisplay,
      fractionDigits: units,
    },
  };
};
