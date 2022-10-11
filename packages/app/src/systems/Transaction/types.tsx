/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  CoinTransactionRequestInput,
  TransactionRequestInput,
  TransactionRequestLike,
  TransactionResult,
} from 'fuels';

import type { AddressType } from '../Account';

export enum TxState {
  default,
  success,
  pending,
  failed,
}

export type TxRecipientAddress = {
  address: string;
  type: AddressType;
};

export type Tx = TransactionResult<any>;
export type TxRequest = TransactionRequestLike;
export type TxInput = TransactionRequestInput;
export type TxInputCoin = CoinTransactionRequestInput;
