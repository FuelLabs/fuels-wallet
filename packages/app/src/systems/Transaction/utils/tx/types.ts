/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: this whole tx utils need be moved to SDK
import type { AddressType } from '@fuel-wallet/types';
import type {
  BN,
  BNInput,
  JsonAbi,
  Transaction,
  TransactionResultReceipt,
} from 'fuels';

export enum ChainName {
  ethereum = 'ethereum',
  fuel = 'fuel',
}

// export enum OperationName {
//   payBlockProducer = 'Pay network fee to block producer',
//   contractCreated = 'Contract created',
//   transfer = 'Transfer asset',
//   contractCall = 'Contract call',
//   contractTransfer = 'Contract transfer',
//   receive = 'Receive asset',
//   mint = 'Mint asset',
//   predicatecall = 'Predicate call',
//   script = 'Script',
//   sent = 'Sent asset',
//   withdrawFromFuel = 'Withdraw from Fuel',
// }

export enum OperationDirection {
  to = 'To',
  from = 'From',
  unknown = 'Unknown',
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

export type FunctionCall = {
  functionSignature: string;
  functionName: string;
  argumentsProvided?: Record<string, any>;
} & Partial<Coin>;

// export type Operation = {
//   name?: OperationName;
//   from?: TxAddress;
//   to?: TxAddress;
//   assetsSent?: Array<Coin>;
//   calls?: Array<FunctionCall>;
// };

// export type InputParam = {
//   inputs: Input[];
// };

// export type OutputParam = {
//   outputs: Output[];
// };

export type TransactionParam = {
  transaction: Transaction;
};
// export type InputOutputParam = InputParam & OutputParam;

export type ReceiptParam = {
  receipts: TransactionResultReceipt[];
};

export type AbiParam = {
  abiMap?: {
    [key: string]: JsonAbi;
  };
};
export type RawPayloadParam = {
  rawPayload?: string;
};

// export type GetOperationParams = {
//   transactionType: TransactionType;
// } & InputOutputParam &
//   ReceiptParam &
//   AbiParam &
//   RawPayloadParam;
// export type GetGasUsedContractCreatedParams = {
//   gasPerByte: BN;
//   gasPriceFactor: BN;
// } & TransactionParam;
// export type GetGasUsedFromReceiptsParams = ReceiptParam;
// export type GetGasUsedParams = GetGasUsedContractCreatedParams &
//   Partial<GetGasUsedFromReceiptsParams>;

// export type GetFeeFromReceiptsParams = {
//   gasPrice: BN;
//   gasPriceFactor: BN;
// } & ReceiptParam;

// export type GetFeeParams = GetGasUsedContractCreatedParams &
//   Omit<GetFeeFromReceiptsParams, 'gasPrice'>;

export type ParseTxParams = {
  gasPerByte: BN;
  gasPriceFactor: BN;
  id?: string;
  time?: string;
} & TransactionParam &
  ReceiptParam &
  AbiParam &
  RawPayloadParam;

// export type Tx = {
//   operations: Operation[];
//   gasUsed: BN;
//   fee: BN;
//   isTypeMint: boolean;
//   isTypeCreate: boolean;
//   isTypeScript: boolean;
//   isStatusPending?: boolean;
//   isStatusSuccess?: boolean;
//   isStatusFailure?: boolean;
//   id?: string;
//   time?: string;
// };
