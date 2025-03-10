import type { AssetFuelAmount } from '@fuel-wallet/types';
import type {
  AddressType,
  BN,
  CallResult,
  CoinTransactionRequestInput,
  CoinTransactionRequestOutput,
  InputContract,
  OutputContract,
  OutputContractCreated,
  Receipt,
  ReceiptType,
  TransactionRequestInput,
  TransactionRequestLike,
} from 'fuels';
import type { OperationFunctionCall } from 'fuels';

export enum TxCategory {
  SEND = 'send',
  RECEIVE = 'receive',
  CONTRACTCALL = 'contractcall',
  SCRIPT = 'script',
  PREDICATE = 'predicate',
  CONTRACTCREATED = 'contractcreated',
  ROUNDEDTRIP = 'roundedtrip',
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

export type GroupedAssets = {
  [assetId: string]: {
    amount: BN;
    assetId: string;
    assetAmount?: AssetFuelAmount;
  };
};

type IdenticalOpsGroup = {
  operation: SimplifiedOperation;
  count: number;
  instances: SimplifiedOperation[];
};

export type ContractCallMetadata = {
  contractId?: string;
  functionName?: string;
  functionData?: OperationFunctionCall;
  amount?: BN;
  assetId?: string;
  depth?: number;
  receiptType?: ReceiptType;
  assetAmount?: AssetFuelAmount;
  operationCount?: number;
  groupedAssets?: Record<string, SimplifiedOperation['assets']>;
  childOperations?: SimplifiedOperation[];
  identicalOps?: Array<IdenticalOpsGroup>;
  direction?: 'in' | 'out';
};

export type SwapMetadata = {
  isSwap: boolean;
  receiveAmount: string;
  receiveAssetId: string;
  totalAmount?: BN;
  operationCount?: number;
  receipts?: Receipt[];
  depth?: number;
  parentReceiptId?: string;
};

export type SimplifiedAddress = {
  address: string;
  type: number; // 0 for contract, 1 for account
};

export type SimplifiedOperation = {
  type: TxCategory;
  from: SimplifiedAddress;
  to: SimplifiedAddress;
  isFromCurrentAccount?: boolean;
  isToCurrentAccount?: boolean;
  assets?: Array<{
    amount: BN;
    assetId: string;
  }>;
  assetsToFrom?: Array<{
    amount: BN;
    assetId: string;
  }>;
  metadata: ContractCallMetadata;
  assetAmount?: AssetFuelAmount;
  receipts?: Receipt[];
  operations?: SimplifiedOperation[];
};

export type SimplifiedFee = {
  total: BN;
  network: BN;
  tip?: BN;
  gasUsed?: BN;
  gasPrice?: BN;
};

export type CategorizedOperations = {
  mainOperations: SimplifiedOperation[];
  otherRootOperations: SimplifiedOperation[];
  otherOperations: SimplifiedOperation[];
};

export type CategorizedV2Operations = {
  mainOperations: SimplifiedOperation[];
  intermediateContractCalls: SimplifiedOperation[];
  notRelatedToCurrentAccount: SimplifiedOperation[];
};

export type SimplifiedTransaction = {
  id: string;
  operations: SimplifiedOperation[];
  categorizedOperations: CategorizedOperations;
  categorizedV2Operations: CategorizedV2Operations;
  fee: SimplifiedFee;
};

export interface AssetFlow {
  assetId: string;
  amount: BN;
  from: string;
  to: string;
  type: 'in' | 'out'; // from perspective of current user
}
