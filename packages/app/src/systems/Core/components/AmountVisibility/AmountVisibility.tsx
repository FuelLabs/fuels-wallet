import type { BigNumberish, BNInput } from 'fuels';

import { formatAmount } from '../../utils';

export type AmountVisibilityProps = {
  value: BigNumberish | BNInput | undefined;
  units?: number | undefined;
  visibility: boolean | undefined;
};

export function AmountVisibility({
  visibility = true,
  value,
  units,
}: AmountVisibilityProps) {
  return <>{visibility ? formatAmount(value, units) : '•••••'}</>;
}
