import type { InputNumberProps } from '@fuel-ui/react';

export const isAmountAllowed: InputNumberProps['isAllowed'] = ({ value }) => {
  console.log(value);
  // Allow to clear the input
  if (!value) {
    return true;
  }

  // Allow numbers like "05" because the react-number-format will handle it
  // but disallow multiple leading zeros like "00" before the decimals
  if (value.charAt(0) === '0' && value.charAt(1) === '0') {
    return false;
  }

  return true;
};
