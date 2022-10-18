import { OutputType } from 'fuels';

import type { TxOutputCoin, TxRequest } from '../types';

export function getCoinInputsFromTx(tx: TxRequest) {
  return (tx?.outputs ?? []).filter(
    (i) => i.type === OutputType.Coin
  ) as TxOutputCoin[];
}
