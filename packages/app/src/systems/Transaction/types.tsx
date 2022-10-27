import type { AddressType } from '@fuels-wallet/types';
import type {
  CallResult,
  CoinTransactionRequestInput,
  CoinTransactionRequestOutput,
  TransactionRequestInput,
  TransactionRequestLike,
  TransactionResponse,
} from 'fuels';

export enum TxType {
  request,
  response,
}

export enum TxStatus {
  pending,
  success,
  error,
}

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

export type TxRequest = TransactionRequestLike;
export type TxSimulateResult = CallResult;
export type TxInput = TransactionRequestInput;
export type TxInputCoin = CoinTransactionRequestInput;
export type TxOutputCoin = CoinTransactionRequestOutput;
export type TxResponse = TransactionResponse;

export type Transaction = {
  id?: string;
  type: TxType;
  status?: TxStatus;
  data?: TxRequest | TxResponse;
};
