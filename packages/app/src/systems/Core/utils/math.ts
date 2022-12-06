import type { BNInput } from 'fuels';
import { bn } from 'fuels';

import { DECIMAL_UNITS, MAX_FRACTION_DIGITS } from '~/config';

export function formatAmount(amount?: BNInput) {
  return bn(amount).format({
    minPrecision: MAX_FRACTION_DIGITS,
  });
}

export function formatFullAmount(amount?: BNInput) {
  return bn(amount).format({
    minPrecision: MAX_FRACTION_DIGITS,
    precision: DECIMAL_UNITS,
  });
}
