import { InputType } from 'fuels';

import type { TxInputCoin, TxRequest } from '../types';

export function getCoinInputsFromTx(tx: TxRequest) {
  return (tx.inputs ?? []).filter(
    (i) => i.type === InputType.Coin
  ) as TxInputCoin[];
}
