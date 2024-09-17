import type { InputNumberProps } from '@fuel-ui/react';

export const isAmountAllowed: InputNumberProps['isAllowed'] = ({ value }) => {
  // Allow to clear the input
  if (!value) {
    return true;
  }

  // Allow numbers starting with '0.' (e.g., 0.0005)
  if (/^0\.\d*$/.test(value)) {
    return true;
  }

  // Disallow leading zeros unless it's part of a decimal number
  if (/^0\d+/.test(value)) {
    return false;
  }

  // Allow positive numbers without leading zeros
  return /^\d+(\.\d+)?$/.test(value);
};
