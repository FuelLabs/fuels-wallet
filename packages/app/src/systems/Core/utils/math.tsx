import type { BigNumberish } from "fuels";
import { toBigInt } from "fuels";

import { DECIMAL_UNITS } from "~/config";
import type { Maybe } from "~/systems/Core";

export function safeBigInt(value?: Maybe<bigint>, defaultValue?: number) {
  return value || toBigInt(defaultValue || 0);
}

export function parseUnits(
  value: string | BigNumberish,
  precision: number = DECIMAL_UNITS
) {
  return toBigInt(parseFloat(value.toString()) * 10 ** precision);
}

export function formatUnits(
  value: string | BigNumberish,
  precision: number = DECIMAL_UNITS
) {
  return parseFloat(value.toString()) / 10 ** precision;
}

export function parseAndFormat(
  value: string | BigNumberish,
  precision: number = DECIMAL_UNITS
) {
  let val = value;
  if (typeof value === "number") {
    val = BigInt(Math.trunc(value));
  }
  return new Intl.NumberFormat("es", {
    // style: "unit",
    minimumFractionDigits: 3,
  }).format(formatUnits(val, precision));
}
