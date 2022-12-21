import type { TransactionRequestLike, TransactionResponse } from 'fuels';

import { reparse } from '~/systems/Core';

// TODO: it's important to move this function to SDK at some point
export function toJSON<T extends TransactionRequestLike | TransactionResponse>(
  tx: T
) {
  return Object.entries(tx).reduce((obj, [key, value]) => {
    const val = value instanceof Uint8Array ? value : reparse(value);
    return { ...obj, [key]: val };
  }, {} as T);
}
