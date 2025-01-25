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
  CONTRACTCALL = 'contractCall',
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
  depth?: number;
  receiptType?: ReceiptType;
  assetAmount?: AssetFuelAmount;
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

export type SimplifiedOperation = {
  type: TxCategory;
  from: string;
  to: string;
  amount?: BN;
  assetId?: string;
  isFromCurrentAccount: boolean;
  metadata: ContractCallMetadata;
  assetAmount?: AssetFuelAmount;
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

export interface AssetFlow {
  assetId: string;
  amount: BN;
  from: string;
  to: string;
  type: 'in' | 'out'; // from perspective of current user
}

export interface SimplifiedAssetFlows {
  assetsIn: AssetFlow[];
  assetsOut: AssetFlow[];
  fees: {
    gasUsed: BN;
    networkFee: BN;
    tip: BN;
    otherFees: AssetFlow[]; // Other fees paid in various assets
  };
  contractInteractions: Array<{
    contractId: string;
    functionName?: string;
  }>;
}
