import type { BigNumberish } from "fuels";
import { toBigInt } from "fuels";

import * as cfg from "~/config";
import type { Maybe } from "~/systems/Core";

export function safeBigInt(value?: Maybe<BigNumberish>, defaultValue?: number) {
  return value || toBigInt(defaultValue || 0);
}

export function unitsToAmount(
  value: Maybe<BigNumberish>,
  precision: number = cfg.DECIMAL_UNITS
) {
  const val = safeBigInt(value);
  return toBigInt(parseFloat(val.toString()) * 10 ** precision);
}

export function amountToUnits(
  value: Maybe<BigNumberish>,
  precision: number = cfg.DECIMAL_UNITS
) {
  const val = safeBigInt(value);
  return parseFloat(val.toString()) / 10 ** precision;
}

type FormatOpts = {
  precision?: number;
  minDigits?: number;
  maxDigits?: number;
  suffix?: string;
};

export function formatUnits(value: Maybe<BigNumberish>, opts?: FormatOpts) {
  const val = typeof value === "number" ? BigInt(Math.trunc(value)) : value;
  const precision = opts?.precision || cfg.DECIMAL_UNITS;
  const minDigits = opts?.minDigits || cfg.MIN_FRACTION_DIGITS;
  const maxDigits = opts?.maxDigits || cfg.MAX_FRACTION_DIGITS;

  const units = amountToUnits(safeBigInt(val), precision);
  const formatted = new Intl.NumberFormat(cfg.FORMAT_LANGUAGE, {
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits,
  }).format(units);

  return `${formatted}${opts?.suffix || ""}`;
}
