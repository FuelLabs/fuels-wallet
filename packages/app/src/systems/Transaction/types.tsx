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
  TransactionRequestInput,
  TransactionRequestLike,
} from 'fuels';

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

export type ContractCallMetadata = {
  depth?: number;
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
  intermediateContractCalls: SimplifiedOperation[];
  notRelatedToCurrentAccount: SimplifiedOperation[];
};

export type SimplifiedTransaction = {
  id: string;
  operations: SimplifiedOperation[];
  categorizedOperations: CategorizedOperations;
  fee: SimplifiedFee;
};

export interface AssetFlow {
  assetId: string;
  amount: BN;
  from: string;
  to: string;
}
