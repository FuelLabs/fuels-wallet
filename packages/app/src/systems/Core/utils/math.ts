import type { BNInput, FormatConfig } from 'fuels';
import { bn } from 'fuels';
import { MAX_FRACTION_DIGITS } from '~/config';

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
