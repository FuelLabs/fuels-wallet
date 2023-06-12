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

export enum ChainName {
  ethereum = 'ethereum',
  fuel = 'fuel',
}

export enum OperationName {
  payBlockProducer = 'Pay network fee to block producer',
  contractCreated = 'Contract created',
  transfer = 'Transfer asset',
  contractCall = 'Contract call',
  contractTransfer = 'Contract transfer',
  receive = 'Receive asset',
  mint = 'Mint asset',
  predicatecall = 'Predicate call',
  script = 'Script',
  withdrawFromFuel = 'Withdraw from Fuel',
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

export type TxAddress = {
  address: string;
  type: AddressType;
  chain?: ChainName;
};

export type Coin = {
  assetId: string;
  amount: BNInput;
};

export type Operation = {
  name?: OperationName;
  from?: TxAddress;
  to?: TxAddress;
  assetsSent?: Array<Coin>;
};

export type InputParam = {
  inputs: Input[];
};

export type OutputParam = {
  outputs: Output[];
};

export type InputOutputParam = InputParam & OutputParam;

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
