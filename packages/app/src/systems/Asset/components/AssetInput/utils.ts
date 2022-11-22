import { bn } from 'fuels';

import { DECIMAL_UNITS } from '~/config';

export function formatAmountLeadingZeros(text: string): string {
  const valueWithoutLeadingZeros = text.replace(/^0\d/, (substring) =>
    substring.replace(/^0+(?=[\d])/, '')
  );
  return valueWithoutLeadingZeros.startsWith('.')
    ? `0${valueWithoutLeadingZeros}`
    : valueWithoutLeadingZeros;
}

export function createAmount(text: string) {
  const textAmountFixed = formatAmountLeadingZeros(text);
  return {
    text: textAmountFixed,
    amount: bn.parseUnits(text, DECIMAL_UNITS),
  };
}
