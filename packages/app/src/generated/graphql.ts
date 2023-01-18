import type { GraphQLClient } from 'graphql-request';
import type * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Address: any;
  AssetId: any;
  BlockId: any;
  Bytes32: any;
  ContractId: any;
  HexString: any;
  MessageId: any;
  Salt: any;
  Signature: any;
  Tai64Timestamp: any;
  TransactionId: any;
  TxPointer: any;
  U64: any;
  UtxoId: any;
};

export type IBalance = {
  __typename?: 'Balance';
  amount: Scalars['U64'];
  assetId: Scalars['AssetId'];
  owner: Scalars['Address'];
};

export type IBalanceConnection = {
  __typename?: 'BalanceConnection';
  /** A list of edges. */
  edges: Array<IBalanceEdge>;
  /** A list of nodes. */
  nodes: Array<IBalance>;
  /** Information to aid in pagination. */
  pageInfo: IPageInfo;
};

/** An edge in a connection. */
export type IBalanceEdge = {
  __typename?: 'BalanceEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node: IBalance;
};

export type IBalanceFilterInput = {
  /** Filter coins based on the `owner` field */
  owner: Scalars['Address'];
};

export type IBlock = {
  __typename?: 'Block';
  consensus: IConsensus;
  header: IHeader;
  id: Scalars['BlockId'];
  transactions: Array<ITransaction>;
};

export type IBlockConnection = {
  __typename?: 'BlockConnection';
  /** A list of edges. */
  edges: Array<IBlockEdge>;
  /** A list of nodes. */
  nodes: Array<IBlock>;
  /** Information to aid in pagination. */
  pageInfo: IPageInfo;
};

/** An edge in a connection. */
export type IBlockEdge = {
  __typename?: 'BlockEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node: IBlock;
};

export type IBreakpoint = {
  contract: Scalars['ContractId'];
  pc: Scalars['U64'];
};

export type IChainInfo = {
  __typename?: 'ChainInfo';
  baseChainHeight: Scalars['U64'];
  consensusParameters: IConsensusParameters;
  latestBlock: IBlock;
  name: Scalars['String'];
  peerCount: Scalars['Int'];
};

export type IChangeOutput = {
  __typename?: 'ChangeOutput';
  amount: Scalars['U64'];
  assetId: Scalars['AssetId'];
  to: Scalars['Address'];
};

export type ICoin = {
  __typename?: 'Coin';
  amount: Scalars['U64'];
  assetId: Scalars['AssetId'];
  blockCreated: Scalars['U64'];
  maturity: Scalars['U64'];
  owner: Scalars['Address'];
  status: ICoinStatus;
  utxoId: Scalars['UtxoId'];
};

export type ICoinConnection = {
  __typename?: 'CoinConnection';
  /** A list of edges. */
  edges: Array<ICoinEdge>;
  /** A list of nodes. */
  nodes: Array<ICoin>;
  /** Information to aid in pagination. */
  pageInfo: IPageInfo;
};

/** An edge in a connection. */
export type ICoinEdge = {
  __typename?: 'CoinEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node: ICoin;
};

export type ICoinFilterInput = {
  /** Asset ID of the coins */
  assetId: InputMaybe<Scalars['AssetId']>;
  /** Address of the owner */
  owner: Scalars['Address'];
};

export type ICoinOutput = {
  __typename?: 'CoinOutput';
  amount: Scalars['U64'];
  assetId: Scalars['AssetId'];
  to: Scalars['Address'];
};

export enum ICoinStatus {
  Spent = 'SPENT',
  Unspent = 'UNSPENT',
}

export type IConsensus = IGenesis | IPoAConsensus;

export type IConsensusParameters = {
  __typename?: 'ConsensusParameters';
  contractMaxSize: Scalars['U64'];
  gasPerByte: Scalars['U64'];
  gasPriceFactor: Scalars['U64'];
  maxGasPerTx: Scalars['U64'];
  maxInputs: Scalars['U64'];
  maxMessageDataLength: Scalars['U64'];
  maxOutputs: Scalars['U64'];
  maxPredicateDataLength: Scalars['U64'];
  maxPredicateLength: Scalars['U64'];
  maxScriptDataLength: Scalars['U64'];
  maxScriptLength: Scalars['U64'];
  maxStorageSlots: Scalars['U64'];
  maxWitnesses: Scalars['U64'];
};

export type IContract = {
  __typename?: 'Contract';
  bytecode: Scalars['HexString'];
  id: Scalars['ContractId'];
  salt: Scalars['Salt'];
};

export type IContractBalance = {
  __typename?: 'ContractBalance';
  amount: Scalars['U64'];
  assetId: Scalars['AssetId'];
  contract: Scalars['ContractId'];
};

export type IContractBalanceConnection = {
  __typename?: 'ContractBalanceConnection';
  /** A list of edges. */
  edges: Array<IContractBalanceEdge>;
  /** A list of nodes. */
  nodes: Array<IContractBalance>;
  /** Information to aid in pagination. */
  pageInfo: IPageInfo;
};

/** An edge in a connection. */
export type IContractBalanceEdge = {
  __typename?: 'ContractBalanceEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node: IContractBalance;
};

export type IContractBalanceFilterInput = {
  /** Filter assets based on the `contractId` field */
  contract: Scalars['ContractId'];
};

export type IContractCreated = {
  __typename?: 'ContractCreated';
  contract: IContract;
  stateRoot: Scalars['Bytes32'];
};

export type IContractOutput = {
  __typename?: 'ContractOutput';
  balanceRoot: Scalars['Bytes32'];
  inputIndex: Scalars['Int'];
  stateRoot: Scalars['Bytes32'];
};

export type IExcludeInput = {
  /** Messages to exclude from the selection. */
  messages: Array<Scalars['MessageId']>;
  /** Utxos to exclude from the selection. */
  utxos: Array<Scalars['UtxoId']>;
};

export type IFailureStatus = {
  __typename?: 'FailureStatus';
  block: IBlock;
  programState: Maybe<IProgramState>;
  reason: Scalars['String'];
  time: Scalars['Tai64Timestamp'];
};

export type IGenesis = {
  __typename?: 'Genesis';
  /**
   * The chain configs define what consensus type to use, what settlement layer to use,
   * rules of block validity, etc.
   */
  chainConfigHash: Scalars['Bytes32'];
  /** The Binary Merkle Tree root of all genesis coins. */
  coinsRoot: Scalars['Bytes32'];
  /** The Binary Merkle Tree root of state, balances, contracts code hash of each contract. */
  contractsRoot: Scalars['Bytes32'];
  /** The Binary Merkle Tree root of all genesis messages. */
  messagesRoot: Scalars['Bytes32'];
};

export type IHeader = {
  __typename?: 'Header';
  /** Hash of the application header. */
  applicationHash: Scalars['Bytes32'];
  /** The layer 1 height of messages and events to include since the last layer 1 block number. */
  daHeight: Scalars['U64'];
  /** Fuel block height. */
  height: Scalars['U64'];
  /** Hash of the header */
  id: Scalars['BlockId'];
  /** Number of output messages in this block. */
  outputMessagesCount: Scalars['U64'];
  /** Merkle root of messages in this block. */
  outputMessagesRoot: Scalars['Bytes32'];
  /** Merkle root of all previous block header hashes. */
  prevRoot: Scalars['Bytes32'];
  /** The block producer time. */
  time: Scalars['Tai64Timestamp'];
  /** Number of transactions in this block. */
  transactionsCount: Scalars['U64'];
  /** Merkle root of transactions. */
  transactionsRoot: Scalars['Bytes32'];
};

export type IInput = IInputCoin | IInputContract | IInputMessage;

export type IInputCoin = {
  __typename?: 'InputCoin';
  amount: Scalars['U64'];
  assetId: Scalars['AssetId'];
  maturity: Scalars['U64'];
  owner: Scalars['Address'];
  predicate: Scalars['HexString'];
  predicateData: Scalars['HexString'];
  txPointer: Scalars['TxPointer'];
  utxoId: Scalars['UtxoId'];
  witnessIndex: Scalars['Int'];
};

export type IInputContract = {
  __typename?: 'InputContract';
  balanceRoot: Scalars['Bytes32'];
  contract: IContract;
  stateRoot: Scalars['Bytes32'];
  txPointer: Scalars['TxPointer'];
  utxoId: Scalars['UtxoId'];
};

export type IInputMessage = {
  __typename?: 'InputMessage';
  amount: Scalars['U64'];
  data: Scalars['HexString'];
  messageId: Scalars['MessageId'];
  nonce: Scalars['U64'];
  predicate: Scalars['HexString'];
  predicateData: Scalars['HexString'];
  recipient: Scalars['Address'];
  sender: Scalars['Address'];
  witnessIndex: Scalars['Int'];
};

export type IMessage = {
  __typename?: 'Message';
  amount: Scalars['U64'];
  daHeight: Scalars['U64'];
  data: Scalars['HexString'];
  fuelBlockSpend: Maybe<Scalars['U64']>;
  messageId: Scalars['MessageId'];
  nonce: Scalars['U64'];
  recipient: Scalars['Address'];
  sender: Scalars['Address'];
};

export type IMessageConnection = {
  __typename?: 'MessageConnection';
  /** A list of edges. */
  edges: Array<IMessageEdge>;
  /** A list of nodes. */
  nodes: Array<IMessage>;
  /** Information to aid in pagination. */
  pageInfo: IPageInfo;
};

/** An edge in a connection. */
export type IMessageEdge = {
  __typename?: 'MessageEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node: IMessage;
};

export type IMessageOutput = {
  __typename?: 'MessageOutput';
  amount: Scalars['U64'];
  recipient: Scalars['Address'];
};

export type IMessageProof = {
  __typename?: 'MessageProof';
  amount: Scalars['U64'];
  data: Scalars['HexString'];
  header: IHeader;
  nonce: Scalars['Bytes32'];
  proofIndex: Scalars['U64'];
  proofSet: Array<Scalars['Bytes32']>;
  recipient: Scalars['Address'];
  sender: Scalars['Address'];
  signature: Scalars['Signature'];
};

export type IMutation = {
  __typename?: 'Mutation';
  continueTx: IRunResult;
  /** Execute a dry-run of the transaction using a fork of current state, no changes are committed. */
  dryRun: Array<IReceipt>;
  endSession: Scalars['Boolean'];
  execute: Scalars['Boolean'];
  produceBlocks: Scalars['U64'];
  reset: Scalars['Boolean'];
  setBreakpoint: Scalars['Boolean'];
  setSingleStepping: Scalars['Boolean'];
  startSession: Scalars['ID'];
  startTx: IRunResult;
  /** Submits transaction to the txpool */
  submit: ITransaction;
};

export type IMutationContinueTxArgs = {
  id: Scalars['ID'];
};

export type IMutationDryRunArgs = {
  tx: Scalars['HexString'];
  utxoValidation: InputMaybe<Scalars['Boolean']>;
};

export type IMutationEndSessionArgs = {
  id: Scalars['ID'];
};

export type IMutationExecuteArgs = {
  id: Scalars['ID'];
  op: Scalars['String'];
};

export type IMutationProduceBlocksArgs = {
  blocksToProduce: Scalars['U64'];
  time: InputMaybe<ITimeParameters>;
};

export type IMutationResetArgs = {
  id: Scalars['ID'];
};

export type IMutationSetBreakpointArgs = {
  breakpoint: IBreakpoint;
  id: Scalars['ID'];
};

export type IMutationSetSingleSteppingArgs = {
  enable: Scalars['Boolean'];
  id: Scalars['ID'];
};

export type IMutationStartTxArgs = {
  id: Scalars['ID'];
  txJson: Scalars['String'];
};

export type IMutationSubmitArgs = {
  tx: Scalars['HexString'];
};

export type INodeInfo = {
  __typename?: 'NodeInfo';
  maxDepth: Scalars['U64'];
  maxTx: Scalars['U64'];
  minGasPrice: Scalars['U64'];
  nodeVersion: Scalars['String'];
  utxoValidation: Scalars['Boolean'];
  vmBacktrace: Scalars['Boolean'];
};

export type IOutput =
  | IChangeOutput
  | ICoinOutput
  | IContractCreated
  | IContractOutput
  | IMessageOutput
  | IVariableOutput;

/**
 * A separate `Breakpoint` type to be used as an output, as a single
 * type cannot act as both input and output type in async-graphql
 */
export type IOutputBreakpoint = {
  __typename?: 'OutputBreakpoint';
  contract: Scalars['ContractId'];
  pc: Scalars['U64'];
};

/** Information about pagination in a connection */
export type IPageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor: Maybe<Scalars['String']>;
};

export type IPoAConsensus = {
  __typename?: 'PoAConsensus';
  /** Gets the signature of the block produced by `PoA` consensus. */
  signature: Scalars['Signature'];
};

export type IProgramState = {
  __typename?: 'ProgramState';
  data: Scalars['HexString'];
  returnType: IReturnType;
};

export type IQuery = {
  __typename?: 'Query';
  balance: IBalance;
  balances: IBalanceConnection;
  block: Maybe<IBlock>;
  blocks: IBlockConnection;
  chain: IChainInfo;
  coin: Maybe<ICoin>;
  coins: ICoinConnection;
  contract: Maybe<IContract>;
  contractBalance: IContractBalance;
  contractBalances: IContractBalanceConnection;
  /** Returns true when the GraphQL API is serving requests. */
  health: Scalars['Boolean'];
  memory: Scalars['String'];
  messageProof: Maybe<IMessageProof>;
  messages: IMessageConnection;
  nodeInfo: INodeInfo;
  register: Scalars['U64'];
  /**
   * For each `query_per_asset`, get some spendable resources(of asset specified by the query) owned by
   * `owner` that add up at least the query amount. The returned resources are actual resources
   * that can be spent. The number of resources is optimized to prevent dust accumulation.
   * Max number of resources and excluded resources can also be specified.
   *
   * Returns:
   * The list of spendable resources per asset from the query. The length of the result is
   * the same as the length of `query_per_asset`. The ordering of assets and `query_per_asset`
   * is the same.
   */
  resourcesToSpend: Array<Array<IResource>>;
  transaction: Maybe<ITransaction>;
  transactions: ITransactionConnection;
  transactionsByOwner: ITransactionConnection;
};

export type IQueryBalanceArgs = {
  assetId: Scalars['AssetId'];
  owner: Scalars['Address'];
};

export type IQueryBalancesArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  filter: IBalanceFilterInput;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
};

export type IQueryBlockArgs = {
  height: InputMaybe<Scalars['U64']>;
  id: InputMaybe<Scalars['BlockId']>;
};

export type IQueryBlocksArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
};

export type IQueryCoinArgs = {
  utxoId: Scalars['UtxoId'];
};

export type IQueryCoinsArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  filter: ICoinFilterInput;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
};

export type IQueryContractArgs = {
  id: Scalars['ContractId'];
};

export type IQueryContractBalanceArgs = {
  asset: Scalars['AssetId'];
  contract: Scalars['ContractId'];
};

export type IQueryContractBalancesArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  filter: IContractBalanceFilterInput;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
};

export type IQueryMemoryArgs = {
  id: Scalars['ID'];
  size: Scalars['U64'];
  start: Scalars['U64'];
};

export type IQueryMessageProofArgs = {
  messageId: Scalars['MessageId'];
  transactionId: Scalars['TransactionId'];
};

export type IQueryMessagesArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  owner: InputMaybe<Scalars['Address']>;
};

export type IQueryRegisterArgs = {
  id: Scalars['ID'];
  register: Scalars['U64'];
};

export type IQueryResourcesToSpendArgs = {
  excludedIds: InputMaybe<IExcludeInput>;
  owner: Scalars['Address'];
  queryPerAsset: Array<ISpendQueryElementInput>;
};

export type IQueryTransactionArgs = {
  id: Scalars['TransactionId'];
};

export type IQueryTransactionsArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
};

export type IQueryTransactionsByOwnerArgs = {
  after: InputMaybe<Scalars['String']>;
  before: InputMaybe<Scalars['String']>;
  first: InputMaybe<Scalars['Int']>;
  last: InputMaybe<Scalars['Int']>;
  owner: Scalars['Address'];
};

export type IReceipt = {
  __typename?: 'Receipt';
  amount: Maybe<Scalars['U64']>;
  assetId: Maybe<Scalars['AssetId']>;
  contract: Maybe<IContract>;
  contractId: Maybe<Scalars['ContractId']>;
  data: Maybe<Scalars['HexString']>;
  digest: Maybe<Scalars['Bytes32']>;
  gas: Maybe<Scalars['U64']>;
  gasUsed: Maybe<Scalars['U64']>;
  is: Maybe<Scalars['U64']>;
  len: Maybe<Scalars['U64']>;
  messageId: Maybe<Scalars['MessageId']>;
  nonce: Maybe<Scalars['Bytes32']>;
  param1: Maybe<Scalars['U64']>;
  param2: Maybe<Scalars['U64']>;
  pc: Maybe<Scalars['U64']>;
  ptr: Maybe<Scalars['U64']>;
  ra: Maybe<Scalars['U64']>;
  rawPayload: Scalars['HexString'];
  rb: Maybe<Scalars['U64']>;
  rc: Maybe<Scalars['U64']>;
  rd: Maybe<Scalars['U64']>;
  reason: Maybe<Scalars['U64']>;
  receiptType: IReceiptType;
  recipient: Maybe<Scalars['Address']>;
  result: Maybe<Scalars['U64']>;
  sender: Maybe<Scalars['Address']>;
  to: Maybe<IContract>;
  toAddress: Maybe<Scalars['Address']>;
  val: Maybe<Scalars['U64']>;
};

export enum IReceiptType {
  Call = 'CALL',
  Log = 'LOG',
  LogData = 'LOG_DATA',
  MessageOut = 'MESSAGE_OUT',
  Panic = 'PANIC',
  Return = 'RETURN',
  ReturnData = 'RETURN_DATA',
  Revert = 'REVERT',
  ScriptResult = 'SCRIPT_RESULT',
  Transfer = 'TRANSFER',
  TransferOut = 'TRANSFER_OUT',
}

/** The schema analog of the [`crate::database::utils::Resource`]. */
export type IResource = ICoin | IMessage;

export enum IReturnType {
  Return = 'RETURN',
  ReturnData = 'RETURN_DATA',
  Revert = 'REVERT',
}

export type IRunResult = {
  __typename?: 'RunResult';
  breakpoint: Maybe<IOutputBreakpoint>;
  jsonReceipts: Array<Scalars['String']>;
  state: IRunState;
};

export enum IRunState {
  /** Stopped on a breakpoint */
  Breakpoint = 'BREAKPOINT',
  /** All breakpoints have been processed, and the program has terminated */
  Completed = 'COMPLETED',
}

export type ISpendQueryElementInput = {
  /** Target amount for the query. */
  amount: Scalars['U64'];
  /** Identifier of the asset to spend. */
  assetId: Scalars['AssetId'];
  /** The maximum number of currencies for selection. */
  max: InputMaybe<Scalars['U64']>;
};

export type ISqueezedOutStatus = {
  __typename?: 'SqueezedOutStatus';
  reason: Scalars['String'];
};

export type ISubmittedStatus = {
  __typename?: 'SubmittedStatus';
  time: Scalars['Tai64Timestamp'];
};

export type ISubscription = {
  __typename?: 'Subscription';
  /**
   * Returns a stream of status updates for the given transaction id.
   * If the current status is [`TransactionStatus::Success`], [`TransactionStatus::SqueezedOut`]
   * or [`TransactionStatus::Failed`] the stream will return that and end immediately.
   * If the current status is [`TransactionStatus::Submitted`] this will be returned
   * and the stream will wait for a future update.
   *
   * This stream will wait forever so it's advised to use within a timeout.
   *
   * It is possible for the stream to miss an update if it is polled slower
   * then the updates arrive. In such a case the stream will close without
   * a status. If this occurs the stream can simply be restarted to return
   * the latest status.
   */
  statusChange: ITransactionStatus;
};

export type ISubscriptionStatusChangeArgs = {
  id: Scalars['TransactionId'];
};

export type ISuccessStatus = {
  __typename?: 'SuccessStatus';
  block: IBlock;
  programState: Maybe<IProgramState>;
  time: Scalars['Tai64Timestamp'];
};

export type ITimeParameters = {
  /** The time interval between subsequent blocks */
  blockTimeInterval: Scalars['U64'];
  /** The time to set on the first block */
  startTime: Scalars['U64'];
};

export type ITransaction = {
  __typename?: 'Transaction';
  bytecodeLength: Maybe<Scalars['U64']>;
  bytecodeWitnessIndex: Maybe<Scalars['Int']>;
  gasLimit: Maybe<Scalars['U64']>;
  gasPrice: Maybe<Scalars['U64']>;
  id: Scalars['TransactionId'];
  inputAssetIds: Maybe<Array<Scalars['AssetId']>>;
  inputContracts: Maybe<Array<IContract>>;
  inputs: Maybe<Array<IInput>>;
  isCreate: Scalars['Boolean'];
  isMint: Scalars['Boolean'];
  isScript: Scalars['Boolean'];
  maturity: Maybe<Scalars['U64']>;
  outputs: Array<IOutput>;
  /** Return the transaction bytes using canonical encoding */
  rawPayload: Scalars['HexString'];
  receipts: Maybe<Array<IReceipt>>;
  receiptsRoot: Maybe<Scalars['Bytes32']>;
  salt: Maybe<Scalars['Salt']>;
  script: Maybe<Scalars['HexString']>;
  scriptData: Maybe<Scalars['HexString']>;
  status: Maybe<ITransactionStatus>;
  storageSlots: Maybe<Array<Scalars['HexString']>>;
  txPointer: Maybe<Scalars['TxPointer']>;
  witnesses: Maybe<Array<Scalars['HexString']>>;
};

export type ITransactionConnection = {
  __typename?: 'TransactionConnection';
  /** A list of edges. */
  edges: Array<ITransactionEdge>;
  /** A list of nodes. */
  nodes: Array<ITransaction>;
  /** Information to aid in pagination. */
  pageInfo: IPageInfo;
};

/** An edge in a connection. */
export type ITransactionEdge = {
  __typename?: 'TransactionEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node: ITransaction;
};

export type ITransactionStatus =
  | IFailureStatus
  | ISqueezedOutStatus
  | ISubmittedStatus
  | ISuccessStatus;

export type IVariableOutput = {
  __typename?: 'VariableOutput';
  amount: Scalars['U64'];
  assetId: Scalars['AssetId'];
  to: Scalars['Address'];
};

export type IAddressTransactionsQueryVariables = Exact<{
  first: InputMaybe<Scalars['Int']>;
  owner: Scalars['Address'];
}>;

export type IAddressTransactionsQuery = {
  __typename?: 'Query';
  coins: {
    __typename?: 'CoinConnection';
    edges: Array<{
      __typename?: 'CoinEdge';
      node: {
        __typename?: 'Coin';
        utxoId: any;
        owner: any;
        amount: any;
        assetId: any;
        maturity: any;
        status: ICoinStatus;
        blockCreated: any;
      };
    }>;
  };
  transactionsByOwner: {
    __typename?: 'TransactionConnection';
    edges: Array<{
      __typename?: 'TransactionEdge';
      node: {
        __typename?: 'Transaction';
        id: any;
        rawPayload: any;
        gasPrice: any | null;
        receipts: Array<{
          __typename?: 'Receipt';
          data: any | null;
          rawPayload: any;
        }> | null;
        status:
          | {
              __typename?: 'FailureStatus';
              time: any;
              reason: string;
              type: 'FailureStatus';
              block: { __typename?: 'Block'; id: any };
            }
          | { __typename?: 'SqueezedOutStatus'; type: 'SqueezedOutStatus' }
          | {
              __typename?: 'SubmittedStatus';
              time: any;
              type: 'SubmittedStatus';
            }
          | {
              __typename?: 'SuccessStatus';
              time: any;
              type: 'SuccessStatus';
              block: { __typename?: 'Block'; id: any };
              programState: {
                __typename?: 'ProgramState';
                returnType: IReturnType;
                data: any;
              } | null;
            }
          | null;
      };
    }>;
  };
};

export type IAddressCoinFragment = {
  __typename?: 'Coin';
  utxoId: any;
  owner: any;
  amount: any;
  assetId: any;
  maturity: any;
  status: ICoinStatus;
  blockCreated: any;
};

export type ITransactionFragment = {
  __typename?: 'Transaction';
  id: any;
  rawPayload: any;
  gasPrice: any | null;
  status:
    | {
        __typename?: 'FailureStatus';
        time: any;
        reason: string;
        type: 'FailureStatus';
        block: { __typename?: 'Block'; id: any };
      }
    | { __typename?: 'SqueezedOutStatus'; type: 'SqueezedOutStatus' }
    | { __typename?: 'SubmittedStatus'; time: any; type: 'SubmittedStatus' }
    | {
        __typename?: 'SuccessStatus';
        time: any;
        type: 'SuccessStatus';
        block: { __typename?: 'Block'; id: any };
        programState: {
          __typename?: 'ProgramState';
          returnType: IReturnType;
          data: any;
        } | null;
      }
    | null;
};

export type IReceiptFragment = {
  __typename?: 'Receipt';
  data: any | null;
  rawPayload: any;
};

export const gqlOperations = {
  Query: {
    AddressTransactions: 'AddressTransactions',
  },
  Fragment: {
    AddressCoin: 'AddressCoin',
    transaction: 'transaction',
    receipt: 'receipt',
  },
};
export const AddressCoinFragmentDoc = gql`
  fragment AddressCoin on Coin {
    utxoId
    owner
    amount
    assetId
    maturity
    status
    blockCreated
  }
`;
export const TransactionFragmentDoc = gql`
  fragment transaction on Transaction {
    id
    rawPayload
    gasPrice
    status {
      type: __typename
      ... on SubmittedStatus {
        time
      }
      ... on SuccessStatus {
        block {
          id
        }
        time
        programState {
          returnType
          data
        }
      }
      ... on FailureStatus {
        block {
          id
        }
        time
        reason
      }
    }
  }
`;
export const ReceiptFragmentDoc = gql`
  fragment receipt on Receipt {
    data
    rawPayload
  }
`;
export const AddressTransactionsDocument = gql`
  query AddressTransactions($first: Int, $owner: Address!) {
    coins(filter: { owner: $owner }, first: 9999) {
      edges {
        node {
          ...AddressCoin
        }
      }
    }
    transactionsByOwner(first: $first, owner: $owner) {
      edges {
        node {
          ...transaction
          receipts {
            ...receipt
          }
        }
      }
    }
  }
  ${AddressCoinFragmentDoc}
  ${TransactionFragmentDoc}
  ${ReceiptFragmentDoc}
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType
) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper
) {
  return {
    AddressTransactions(
      variables: IAddressTransactionsQueryVariables,
      requestHeaders?: Dom.RequestInit['headers']
    ): Promise<IAddressTransactionsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<IAddressTransactionsQuery>(
            AddressTransactionsDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        'AddressTransactions',
        'query'
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
