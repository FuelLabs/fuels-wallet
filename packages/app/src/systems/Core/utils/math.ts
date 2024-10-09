import type { BN, BNInput } from 'fuels';
import { DECIMAL_WEI, DEFAULT_MIN_PRECISION, bn } from 'fuels';

const MINIMUM_ZEROS_TO_DISPLAY = 2; // it means 0.001 (at least two zeros in decimals)

export type FormatAmountResult = {
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

export const formatAmount = (
  input: BNInput | null | undefined = '0',
  units: number | undefined = DECIMAL_WEI
): FormatAmountResult => {
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
          precision: DEFAULT_MIN_PRECISION,
        })}`,
        fractionDigits: DEFAULT_MIN_PRECISION,
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
        precision: DEFAULT_MIN_PRECISION,
      }),
      fractionDigits: DEFAULT_MIN_PRECISION,
    },
    original: {
      display: originalDisplay,
      fractionDigits: units,
    },
  };
};
