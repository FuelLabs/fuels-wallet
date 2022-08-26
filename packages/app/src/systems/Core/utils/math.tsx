import * as ethers from "ethers";
import type { BigNumberish } from "fuels";
import { toBigInt } from "fuels";

import { DECIMAL_UNITS, FIXED_UNITS } from "~/config";
import type { Maybe } from "~/types";

export function toFixed(
  number: Maybe<BigNumberish>,
  maxDecimals: number = FIXED_UNITS
) {
  const [amount, decimals = "0"] = String(number?.toString() || "0.0").split(
    "."
  );
  const minDecimals = decimals.split("").findIndex((u: string) => u !== "0");
  const canShowMinDecimals = minDecimals >= maxDecimals && amount === "0";
  const decimalFormatted = decimals.slice(
    0,
    canShowMinDecimals ? minDecimals + 1 : maxDecimals
  );
  return [amount || 0, ".", ...decimalFormatted].join("");
}

export function formatUnits(
  number: BigNumberish,
  precision: number = DECIMAL_UNITS
): string {
  return ethers.utils.formatUnits(number, precision);
}

export function safeBigInt(value?: Maybe<bigint>, defaultValue?: number) {
  return value || toBigInt(defaultValue || 0);
}

export function parseAndFormat(
  value: string | BigNumberish,
  precision: number = DECIMAL_UNITS
) {
  let val = value;
  if (typeof value === "number") {
    val = BigInt(Math.trunc(value));
  }
  return ethers.utils.commify(
    toFixed(formatUnits(val, precision), FIXED_UNITS)
  );
}
