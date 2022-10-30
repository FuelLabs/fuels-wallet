import { InputType, OutputType } from 'fuels';

import type {
  TxInputCoin,
  TxOutputCoin,
  TxRequest,
  TxResponse,
} from '../types';

import { BLOCK_EXPLORER_URL } from '~/config';

export function parseTransaction<T extends TxRequest | TxResponse>(tx: T) {
  return Object.entries(tx).reduce((obj, [key, value]) => {
    const val =
      value instanceof Uint8Array ? value : JSON.parse(JSON.stringify(value));
    return { ...obj, [key]: val };
  }, {} as T);
}

export function getCoinInputsFromTx(tx?: TxRequest) {
  return (tx?.inputs ?? []).filter(
    (i) => i.type === InputType.Coin
  ) as TxInputCoin[];
}

export function getCoinOutputsFromTx(tx?: TxRequest) {
  return (tx?.outputs ?? []).filter(
    (i) => i.type === OutputType.Coin
  ) as TxOutputCoin[];
}

export function getBlockExplorerLink({
  path,
  provider,
}: {
  path: string;
  provider: string;
}) {
  return `${BLOCK_EXPLORER_URL}${path}?providerUrl=${encodeURIComponent(
    provider
  )}`;
}

export * from './error';
