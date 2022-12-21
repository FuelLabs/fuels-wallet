/* eslint-disable @typescript-eslint/no-explicit-any */

export function reparse(v: any) {
  return JSON.parse(JSON.stringify(v));
}
