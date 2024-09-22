import type { BNInput, BigNumberish } from 'fuels';

import { formatAmount } from '../../utils';

export type AmountVisibilityProps = {
  value?: BigNumberish | BNInput;
  units?: number;
  visibility?: boolean;
};

export function AmountVisibility({
  visibility = true,
  value,
  units,
}: AmountVisibilityProps) {
  return (
    <>
      {visibility
        ? formatAmount({ amount: value, options: { units } })
        : '•••••'}
    </>
  );
}
