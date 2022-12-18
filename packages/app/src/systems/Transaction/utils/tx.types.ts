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

export enum Operations {
  payBlockProducer = 'Pay network fee to block producer',
  contractCreated = 'Contract created',
  transfer = 'Transfer asset',
  contractCall = 'Contract call',
}

export type GqlTransactionStatus =
  | 'FailureStatus'
  | 'SubmittedStatus'
  | 'SuccessStatus';

export enum Status {
  pending = 'Pending',
  success = 'Success',
  failure = 'Failure',
}
export enum Type {
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
  name?: string;
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
};

export type Tx = {
  operations: Operation[];
  gasUsed: BN;
  fee: BN;
  type: Type;
  totalAssetsSent: Coin[];
  isTypeMint: boolean;
  isTypeCreate: boolean;
  isTypeScript: boolean;
  status?: Status;
  isStatusPending?: boolean;
  isStatusSuccess?: boolean;
  isStatusFailure?: boolean;
  id?: string;
};
