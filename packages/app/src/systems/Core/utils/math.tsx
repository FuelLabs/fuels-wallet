/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * We just add Decimal.js here as a temporarily solution since our SDK
 * isn't handle well with float numbers inside strings, like bn('1.5')
 * TODO: remove Decimal.js here later
 */
import Decimal from 'decimal.js';
import type { BigNumberish } from 'fuels';
import { BN, bn } from 'fuels';

import type { Maybe } from '../types';

import {
  DECIMAL_UNITS,
  MIN_FRACTION_DIGITS,
  MAX_FRACTION_DIGITS,
  FORMAT_LANGUAGE,
} from '~/config';

export function safeBigInt(
  value?: Maybe<BigNumberish> | bigint,
  defaultValue: number = 0
) {
  return value || bn(defaultValue);
}

export function unitsToAmount(
  value: Maybe<BigNumberish> | bigint,
  precision: number = DECIMAL_UNITS
) {
  const safeVal = safeBigInt(value);
  if (safeVal instanceof BN) {
    return bn(safeVal).mul(10).pow(precision).toNumber();
  }
  return new Decimal(safeVal.toString()).toNumber() * 10 ** precision;
}

export function amountToUnits(
  value: Maybe<BigNumberish> | bigint,
  precision: number = DECIMAL_UNITS
) {
  const safeVal = safeBigInt(value);
  if (safeVal instanceof BN) {
    return bn(safeVal).div(10).pow(precision).toNumber();
  }
  return new Decimal(safeVal.toString()).toNumber() / 10 ** precision;
}

type FormatOpts = {
  precision?: number;
  minDigits?: number;
  maxDigits?: number;
  suffix?: string;
};

export function formatUnits(value: any, opts?: FormatOpts) {
  let val = value;

  if (typeof value === 'number') {
    val = new Decimal(Math.trunc(value));
  }
  if (value instanceof BN) {
    val = value.toString();
  }

  const precision = opts?.precision || DECIMAL_UNITS;
  const minDigits = opts?.minDigits || MIN_FRACTION_DIGITS;
  const maxDigits = opts?.maxDigits || MAX_FRACTION_DIGITS;

  const units = amountToUnits(safeBigInt(val), precision);
  const formatted = new Intl.NumberFormat(FORMAT_LANGUAGE, {
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits,
  }).format(parseFloat(units.toString()));

  return `${formatted}${opts?.suffix || ''}`;
}
