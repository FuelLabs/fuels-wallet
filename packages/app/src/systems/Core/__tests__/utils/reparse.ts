/* eslint-disable @typescript-eslint/no-explicit-any */

// accept any because JSON.stringify also accepts
export function reparse(v: any) {
  return JSON.parse(JSON.stringify(v));
}
