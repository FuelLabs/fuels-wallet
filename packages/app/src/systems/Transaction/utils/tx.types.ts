// TODO: this whole tx utils need be moved to SDK
import type { AddressType } from '@fuel-wallet/types';
import type {
  BN,
  BNInput,
  Input,
  Output,
  Transaction,
  TransactionResultReceipt,
  TransactionType,
} from 'fuels';

export enum OperationName {
  payBlockProducer = 'Pay network fee to block producer',
  contractCreated = 'Contract created',
  transfer = 'Transfer asset',
  contractCall = 'Contract call',
  receive = 'Receive asset',
  mint = 'Mint asset',
  predicatecall = 'Predicate call',
  script = 'Script',
}

export enum OperationDirection {
  to = 'To',
  from = 'From',
  unknown = 'Unknown',
}

export type GqlTransactionStatus =
  | 'FailureStatus'
  | 'SubmittedStatus'
  | 'SuccessStatus'
  | 'SqueezedOutStatus';

export enum TxStatus {
  pending = 'Pending',
  success = 'Success',
  failure = 'Failure',
  squeezedOut = 'SqueezedOut',
}

export enum TxType {
  create = 'Create',
  mint = 'Mint',
  script = 'Script',
}

export type Address = {
  address: string;
  type: AddressType;
};

export type Coin = {
  assetId: string;
  amount: BNInput;
};

export type Operation = {
  name?: OperationName;
  from?: Address;
  to?: Address;
  assetsSent?: Array<Coin>;
};

export type InputOutputParam = {
  inputs: Input[];
  outputs: Output[];
};

export type ReceiptParam = {
  receipts: TransactionResultReceipt[];
};

export type GetOperationParams = InputOutputParam &
  ReceiptParam & {
    transactionType: TransactionType;
  };

export type GetGasUsedContractCreatedParams = {
  transaction: Transaction;
  gasPerByte: BN;
  gasPriceFactor: BN;
};

export type GetGasUsedParams = {
  transaction: Transaction;
  receipts?: TransactionResultReceipt[];
  gasPerByte: BN;
  gasPriceFactor: BN;
};

export type GetFeeFromReceiptsParams = {
  gasPrice: BN;
  receipts: TransactionResultReceipt[];
  gasPriceFactor: BN;
};

export type GetFeeParams = {
  transaction: Transaction;
  gasPerByte: BN;
  receipts: TransactionResultReceipt[];
  gasPriceFactor: BN;
};

export type ParseTxParams = {
  transaction: Transaction;
  receipts: TransactionResultReceipt[];
  gasPerByte: BN;
  gasPriceFactor: BN;
  gqlStatus?: GqlTransactionStatus;
  id?: string;
  time?: string;
};

export type Tx = {
  operations: Operation[];
  gasUsed: BN;
  fee: BN;
  type: TxType;
  totalAssetsSent: Coin[];
  isTypeMint: boolean;
  isTypeCreate: boolean;
  isTypeScript: boolean;
  status?: TxStatus;
  isStatusPending?: boolean;
  isStatusSuccess?: boolean;
  isStatusFailure?: boolean;
  id?: string;
  time?: string;
};
