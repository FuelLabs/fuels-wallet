import type {
  AddressType,
  BN,
  CallResult,
  CoinTransactionRequestInput,
  CoinTransactionRequestOutput,
  InputContract,
  OutputContract,
  OutputContractCreated,
  TransactionRequest,
  TransactionRequestInput,
  TransactionRequestLike,
  TransactionStatus,
  TransactionSummary,
} from 'fuels';
import type { OperationFunctionCall } from 'fuels';
import type { ReactNode } from 'react';

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

export type ContractCallMetadata = {
  contractId?: string;
  functionName?: string;
  functionData?: OperationFunctionCall;
  amount?: BN;
  assetId?: string;
  isContractCallGroup?: boolean;
  operationCount?: number;
  totalAmount?: BN;
};

export type SwapMetadata = {
  isSwap: boolean;
  receiveAmount: string;
  receiveAssetId: string;
  totalAmount?: BN;
  operationCount?: number;
};

export type SimplifiedOperation = {
  type: TxCategory;
  from: string;
  to: string;
  amount?: BN;
  assetId?: string;
  isFromCurrentAccount?: boolean;
  groupId?: string;
  metadata?: ContractCallMetadata | SwapMetadata;
};

export type SimplifiedFee = {
  total: BN;
  network: BN;
  tip?: BN;
  gasUsed?: BN;
  gasPrice?: BN;
};

export type SimplifiedTransaction = {
  id?: string;
  operations: SimplifiedOperation[];
  status: TransactionStatus;
  timestamp?: Date;
  fee: SimplifiedFee;
  origin?: {
    name: string;
    favicon?: string;
    url?: string;
  };
  original: {
    summary: TransactionSummary;
    request?: TransactionRequest;
  };
};

export type SimplifiedTransactionViewProps = {
  transaction: SimplifiedTransaction;
  showDetails?: boolean;
  isLoading?: boolean;
  footer?: ReactNode;
};
