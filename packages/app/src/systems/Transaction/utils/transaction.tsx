import type { TransactionRequestLike, TransactionResponse } from 'fuels';

export function toJSON<T extends TransactionRequestLike | TransactionResponse>(
  tx: T
) {
  return Object.entries(tx).reduce((obj, [key, value]) => {
    const val =
      value instanceof Uint8Array ? value : JSON.parse(JSON.stringify(value));
    return { ...obj, [key]: val };
  }, {} as T);
}
