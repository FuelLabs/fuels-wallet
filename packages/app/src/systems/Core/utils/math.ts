import type { BNInput } from 'fuels';
import { bn } from 'fuels';
import { MAX_FRACTION_DIGITS } from '~/config';

export function formatAmount(amount?: BNInput, units?: number) {
  return bn(amount).format({
    precision: MAX_FRACTION_DIGITS,
    units,
  });
}
