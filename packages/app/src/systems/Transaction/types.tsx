import type { AddressType, AssetAmount } from '@fuel-wallet/types';
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
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
}

export enum TxCategory {
  SEND = 'send',
  RECEIVE = 'receive',
  CONTRACTCALL = 'contractcall',
  SCRIPT = 'script',
  PREDICATE = 'predicate',
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
  category?: TxCategory;
  date?: Date;
  from?: TxRecipientAddress;
  to?: TxRecipientAddress;
  amount?: AssetAmount;
  data?: TxRequest | TxResponse;
};
