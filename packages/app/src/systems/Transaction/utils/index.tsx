import { OutputType } from 'fuels';

import type { TxOutputCoin, TxRequest, TxResponse } from '../types';

export function parseTransaction<T extends TxRequest | TxResponse>(tx: T) {
  return Object.entries(tx).reduce((obj, [key, value]) => {
    const val =
      value instanceof Uint8Array ? value : JSON.parse(JSON.stringify(value));
    return { ...obj, [key]: val };
  }, {} as T);
}

export function getCoinOutputsFromTx(tx: TxRequest) {
  return (tx?.outputs ?? []).filter(
    (i) => i.type === OutputType.Coin
  ) as TxOutputCoin[];
}
