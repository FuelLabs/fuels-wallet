import type {
  AddressType,
  CallResult,
  CoinTransactionRequestInput,
  CoinTransactionRequestOutput,
  InputContract,
  OutputContract,
  OutputContractCreated,
  TransactionRequestInput,
  TransactionRequestLike,
} from 'fuels';

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
export type TxOutputContractCreated = OutputContractCreated;

export type TransactionCursor = {
  address: string;
  size: number;
  providerUrl: string;
  endCursor: string;
};

export enum OperationDirection {
  to = 'To',
  from = 'From',
  unknown = 'Unknown',
}
