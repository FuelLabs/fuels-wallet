import type { AddressType } from '@fuel-wallet/types';
import type {
  CallResult,
  CoinTransactionRequestInput,
  CoinTransactionRequestOutput,
  InputContract,
  OutputContract,
  TransactionRequestInput,
  TransactionRequestLike,
  TransactionResponse,
  TransactionType,
} from 'fuels';

export enum TxStatus {
  pending,
  success,
  error,
}

export type TxRecipientAddress = {
  address: string;
  type: AddressType;
};

export type TxRequest = TransactionRequestLike;
export type TxSimulateResult = CallResult;
export type TxInput = TransactionRequestInput;
export type TxInputCoin = CoinTransactionRequestInput;
export type TxInputContract = InputContract;
export type TxOutputCoin = CoinTransactionRequestOutput;
export type TxOutputContract = OutputContract;
export type TxResponse = TransactionResponse;

export type Transaction = {
  id?: string;
  type?: TransactionType;
  status?: TxStatus;
  data?: TxRequest | TxResponse;
};
