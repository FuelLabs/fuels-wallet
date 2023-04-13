// TODO: this whole tx utils need be moved to SDK
import type { AddressType } from '@fuel-wallet/types';
import type {
  BN,
  BNInput,
  Input,
  JsonFlatAbi,
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
  contractTransfer = 'Contract transfer',
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

export type FunctionCall = {
  functionSignature: string;
  functionName: string;
  argumentsProvided?: Record<string, any>;
} & Partial<Coin>;

export type Operation = {
  name?: OperationName;
  from?: Address;
  to?: Address;
  assetsSent?: Array<Coin>;
  calls?: Array<FunctionCall>;
};

export type InputOutputParam = {
  inputs: Input[];
  outputs: Output[];
};

export type TransactionParam = {
  transaction: Transaction;
};

export type ReceiptParam = {
  receipts: TransactionResultReceipt[];
};

export type AbiParam = {
  abiMap?: {
    [key: string]: JsonFlatAbi;
  };
};
export type RawPayloadParam = {
  rawPayload?: string;
};

export type GetOperationParams = {
  transactionType: TransactionType;
} & InputOutputParam &
  ReceiptParam &
  AbiParam &
  RawPayloadParam;
export type GetGasUsedContractCreatedParams = {
  gasPerByte: BN;
  gasPriceFactor: BN;
} & TransactionParam;
export type GetGasUsedFromReceiptsParams = ReceiptParam;
export type GetGasUsedParams = GetGasUsedContractCreatedParams &
  Partial<GetGasUsedFromReceiptsParams>;

export type GetFeeFromReceiptsParams = {
  gasPrice: BN;
  gasPriceFactor: BN;
} & ReceiptParam;

export type GetFeeParams = GetGasUsedContractCreatedParams &
  Omit<GetFeeFromReceiptsParams, 'gasPrice'>;

export type ParseTxParams = {
  gasPerByte: BN;
  gasPriceFactor: BN;
  gqlStatus?: GqlTransactionStatus;
  id?: string;
  time?: string;
} & TransactionParam &
  ReceiptParam &
  AbiParam &
  RawPayloadParam;

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
