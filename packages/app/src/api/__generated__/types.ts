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
  Address: string;
  AssetId: string;
  BlockId: string;
  Bytes32: string;
  ContractId: string;
  /**
   * Implement the DateTime<Utc> scalar
   *
   * The input/output is a string in RFC3339 format.
   */
  DateTime: string;
  HexString: string;
  MessageId: string;
  Salt: string;
  Signature: string;
  TransactionId: string;
  TxPointer: string;
  U64: string;
  UtxoId: string;
};

export type Balance = {
  __typename: 'Balance';
  amount: Scalars['U64'];
  assetId: Scalars['AssetId'];
  owner: Scalars['Address'];
};

export type BalanceConnection = {
  __typename: 'BalanceConnection';
  /** A list of edges. */
  edges: Array<BalanceEdge>;
  /** A list of nodes. */
  nodes: Array<Balance>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type BalanceEdge = {
  __typename: 'BalanceEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node: Balance;
};

export type BalanceFilterInput = {
  /** Filter coins based on the `owner` field */
  owner: Scalars['Address'];
};

export type Block = {
  __typename: 'Block';
  header: Header;
  id: Scalars['BlockId'];
  transactions: Array<Transaction>;
};

export type BlockConnection = {
  __typename: 'BlockConnection';
  /** A list of edges. */
  edges: Array<BlockEdge>;
  /** A list of nodes. */
  nodes: Array<Block>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type BlockEdge = {
  __typename: 'BlockEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node: Block;
};

export type Breakpoint = {
  contract: Scalars['ContractId'];
  pc: Scalars['U64'];
};

export type ChainInfo = {
  __typename: 'ChainInfo';
  baseChainHeight: Scalars['U64'];
  consensusParameters: ConsensusParameters;
  latestBlock: Block;
  name: Scalars['String'];
  peerCount: Scalars['Int'];
};

export type ChangeOutput = {
  __typename: 'ChangeOutput';
  amount: Scalars['U64'];
  assetId: Scalars['AssetId'];
  to: Scalars['Address'];
};

export type Coin = {
  __typename: 'Coin';
  amount: Scalars['U64'];
  assetId: Scalars['AssetId'];
  blockCreated: Scalars['U64'];
  maturity: Scalars['U64'];
  owner: Scalars['Address'];
  status: CoinStatus | '%future added value';
  utxoId: Scalars['UtxoId'];
};

export type CoinConnection = {
  __typename: 'CoinConnection';
  /** A list of edges. */
  edges: Array<CoinEdge>;
  /** A list of nodes. */
  nodes: Array<Coin>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type CoinEdge = {
  __typename: 'CoinEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node: Coin;
};

export type CoinFilterInput = {
  /** Asset ID of the coins */
  assetId?: InputMaybe<Scalars['AssetId']>;
  /** Address of the owner */
  owner: Scalars['Address'];
};

export type CoinOutput = {
  __typename: 'CoinOutput';
  amount: Scalars['U64'];
  assetId: Scalars['AssetId'];
  to: Scalars['Address'];
};

export enum CoinStatus {
  Spent = 'SPENT',
  Unspent = 'UNSPENT',
}

export type ConsensusParameters = {
  __typename: 'ConsensusParameters';
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

export type Contract = {
  __typename: 'Contract';
  bytecode: Scalars['HexString'];
  id: Scalars['ContractId'];
  salt: Scalars['Salt'];
};

export type ContractBalance = {
  __typename: 'ContractBalance';
  amount: Scalars['U64'];
  assetId: Scalars['AssetId'];
  contract: Scalars['ContractId'];
};

export type ContractBalanceConnection = {
  __typename: 'ContractBalanceConnection';
  /** A list of edges. */
  edges: Array<ContractBalanceEdge>;
  /** A list of nodes. */
  nodes: Array<ContractBalance>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ContractBalanceEdge = {
  __typename: 'ContractBalanceEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node: ContractBalance;
};

export type ContractBalanceFilterInput = {
  /** Filter assets based on the `contractId` field */
  contract: Scalars['ContractId'];
};

export type ContractCreated = {
  __typename: 'ContractCreated';
  contract: Contract;
  stateRoot: Scalars['Bytes32'];
};

export type ContractOutput = {
  __typename: 'ContractOutput';
  balanceRoot: Scalars['Bytes32'];
  inputIndex: Scalars['Int'];
  stateRoot: Scalars['Bytes32'];
};

export type ExcludeInput = {
  /** Messages to exclude from the selection. */
  messages: Array<Scalars['MessageId']>;
  /** Utxos to exclude from the selection. */
  utxos: Array<Scalars['UtxoId']>;
};

export type FailureStatus = {
  __typename: 'FailureStatus';
  block: Block;
  programState?: Maybe<ProgramState>;
  reason: Scalars['String'];
  time: Scalars['DateTime'];
};

export type Header = {
  __typename: 'Header';
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
  time: Scalars['DateTime'];
  /** Number of transactions in this block. */
  transactionsCount: Scalars['U64'];
  /** Merkle root of transactions. */
  transactionsRoot: Scalars['Bytes32'];
};

export type Input =
  | InputCoin
  | InputContract
  | InputMessage
  | { __typename?: '%other' };

export type InputCoin = {
  __typename: 'InputCoin';
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

export type InputContract = {
  __typename: 'InputContract';
  balanceRoot: Scalars['Bytes32'];
  contract: Contract;
  stateRoot: Scalars['Bytes32'];
  txPointer: Scalars['TxPointer'];
  utxoId: Scalars['UtxoId'];
};

export type InputMessage = {
  __typename: 'InputMessage';
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

export type Message = {
  __typename: 'Message';
  amount: Scalars['U64'];
  daHeight: Scalars['U64'];
  data: Scalars['HexString'];
  fuelBlockSpend?: Maybe<Scalars['U64']>;
  messageId: Scalars['MessageId'];
  nonce: Scalars['U64'];
  recipient: Scalars['Address'];
  sender: Scalars['Address'];
};

export type MessageConnection = {
  __typename: 'MessageConnection';
  /** A list of edges. */
  edges: Array<MessageEdge>;
  /** A list of nodes. */
  nodes: Array<Message>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type MessageEdge = {
  __typename: 'MessageEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node: Message;
};

export type MessageOutput = {
  __typename: 'MessageOutput';
  amount: Scalars['U64'];
  recipient: Scalars['Address'];
};

export type MessageProof = {
  __typename: 'MessageProof';
  amount: Scalars['U64'];
  data: Scalars['HexString'];
  header: Header;
  nonce: Scalars['Bytes32'];
  proofIndex: Scalars['U64'];
  proofSet: Array<Scalars['Bytes32']>;
  recipient: Scalars['Address'];
  sender: Scalars['Address'];
  signature: Scalars['Signature'];
};

export type Mutation = {
  __typename: 'Mutation';
  continueTx: RunResult;
  /** Execute a dry-run of the transaction using a fork of current state, no changes are committed. */
  dryRun: Array<Receipt>;
  endSession: Scalars['Boolean'];
  execute: Scalars['Boolean'];
  produceBlocks: Scalars['U64'];
  reset: Scalars['Boolean'];
  setBreakpoint: Scalars['Boolean'];
  setSingleStepping: Scalars['Boolean'];
  startSession: Scalars['ID'];
  startTx: RunResult;
  /** Submits transaction to the txpool */
  submit: Transaction;
};

export type MutationContinueTxArgs = {
  id: Scalars['ID'];
};

export type MutationDryRunArgs = {
  tx: Scalars['HexString'];
  utxoValidation?: InputMaybe<Scalars['Boolean']>;
};

export type MutationEndSessionArgs = {
  id: Scalars['ID'];
};

export type MutationExecuteArgs = {
  id: Scalars['ID'];
  op: Scalars['String'];
};

export type MutationProduceBlocksArgs = {
  blocksToProduce: Scalars['U64'];
  time?: InputMaybe<TimeParameters>;
};

export type MutationResetArgs = {
  id: Scalars['ID'];
};

export type MutationSetBreakpointArgs = {
  breakpoint: Breakpoint;
  id: Scalars['ID'];
};

export type MutationSetSingleSteppingArgs = {
  enable: Scalars['Boolean'];
  id: Scalars['ID'];
};

export type MutationStartTxArgs = {
  id: Scalars['ID'];
  txJson: Scalars['String'];
};

export type MutationSubmitArgs = {
  tx: Scalars['HexString'];
};

export type NodeInfo = {
  __typename: 'NodeInfo';
  maxDepth: Scalars['U64'];
  maxTx: Scalars['U64'];
  minGasPrice: Scalars['U64'];
  nodeVersion: Scalars['String'];
  utxoValidation: Scalars['Boolean'];
  vmBacktrace: Scalars['Boolean'];
};

export type Output =
  | ChangeOutput
  | CoinOutput
  | ContractCreated
  | ContractOutput
  | MessageOutput
  | VariableOutput
  | { __typename?: '%other' };

/**
 * A separate `Breakpoint` type to be used as an output, as a single
 * type cannot act as both input and output type in async-graphql
 */
export type OutputBreakpoint = {
  __typename: 'OutputBreakpoint';
  contract: Scalars['ContractId'];
  pc: Scalars['U64'];
};

/** Information about pagination in a connection */
export type PageInfo = {
  __typename: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

export type ProgramState = {
  __typename: 'ProgramState';
  data: Scalars['HexString'];
  returnType: ReturnType | '%future added value';
};

export type Query = {
  __typename: 'Query';
  balance: Balance;
  balances: BalanceConnection;
  block?: Maybe<Block>;
  blocks: BlockConnection;
  chain: ChainInfo;
  coin?: Maybe<Coin>;
  coins: CoinConnection;
  contract?: Maybe<Contract>;
  contractBalance: ContractBalance;
  contractBalances: ContractBalanceConnection;
  /** Returns true when the GraphQL API is serving requests. */
  health: Scalars['Boolean'];
  memory: Scalars['String'];
  messageProof?: Maybe<MessageProof>;
  messages: MessageConnection;
  nodeInfo: NodeInfo;
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
  resourcesToSpend: Array<Array<Resource>>;
  transaction?: Maybe<Transaction>;
  transactions: TransactionConnection;
  transactionsByOwner: TransactionConnection;
};

export type QueryBalanceArgs = {
  assetId: Scalars['AssetId'];
  owner: Scalars['Address'];
};

export type QueryBalancesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter: BalanceFilterInput;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type QueryBlockArgs = {
  height?: InputMaybe<Scalars['U64']>;
  id?: InputMaybe<Scalars['BlockId']>;
};

export type QueryBlocksArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type QueryCoinArgs = {
  utxoId: Scalars['UtxoId'];
};

export type QueryCoinsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter: CoinFilterInput;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type QueryContractArgs = {
  id: Scalars['ContractId'];
};

export type QueryContractBalanceArgs = {
  asset: Scalars['AssetId'];
  contract: Scalars['ContractId'];
};

export type QueryContractBalancesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter: ContractBalanceFilterInput;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type QueryMemoryArgs = {
  id: Scalars['ID'];
  size: Scalars['U64'];
  start: Scalars['U64'];
};

export type QueryMessageProofArgs = {
  messageId: Scalars['MessageId'];
  transactionId: Scalars['TransactionId'];
};

export type QueryMessagesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  owner?: InputMaybe<Scalars['Address']>;
};

export type QueryRegisterArgs = {
  id: Scalars['ID'];
  register: Scalars['U64'];
};

export type QueryResourcesToSpendArgs = {
  excludedIds?: InputMaybe<ExcludeInput>;
  owner: Scalars['Address'];
  queryPerAsset: Array<SpendQueryElementInput>;
};

export type QueryTransactionArgs = {
  id: Scalars['TransactionId'];
};

export type QueryTransactionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type QueryTransactionsByOwnerArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  owner: Scalars['Address'];
};

export type Receipt = {
  __typename: 'Receipt';
  amount?: Maybe<Scalars['U64']>;
  assetId?: Maybe<Scalars['AssetId']>;
  contract?: Maybe<Contract>;
  contractId?: Maybe<Scalars['ContractId']>;
  data?: Maybe<Scalars['HexString']>;
  digest?: Maybe<Scalars['Bytes32']>;
  gas?: Maybe<Scalars['U64']>;
  gasUsed?: Maybe<Scalars['U64']>;
  is?: Maybe<Scalars['U64']>;
  len?: Maybe<Scalars['U64']>;
  messageId?: Maybe<Scalars['MessageId']>;
  nonce?: Maybe<Scalars['Bytes32']>;
  param1?: Maybe<Scalars['U64']>;
  param2?: Maybe<Scalars['U64']>;
  pc?: Maybe<Scalars['U64']>;
  ptr?: Maybe<Scalars['U64']>;
  ra?: Maybe<Scalars['U64']>;
  rawPayload: Scalars['HexString'];
  rb?: Maybe<Scalars['U64']>;
  rc?: Maybe<Scalars['U64']>;
  rd?: Maybe<Scalars['U64']>;
  reason?: Maybe<Scalars['U64']>;
  receiptType: ReceiptType | '%future added value';
  recipient?: Maybe<Scalars['Address']>;
  result?: Maybe<Scalars['U64']>;
  sender?: Maybe<Scalars['Address']>;
  to?: Maybe<Contract>;
  toAddress?: Maybe<Scalars['Address']>;
  val?: Maybe<Scalars['U64']>;
};

export enum ReceiptType {
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
export type Resource = Coin | Message | { __typename?: '%other' };

export enum ReturnType {
  Return = 'RETURN',
  ReturnData = 'RETURN_DATA',
  Revert = 'REVERT',
}

export type RunResult = {
  __typename: 'RunResult';
  breakpoint?: Maybe<OutputBreakpoint>;
  jsonReceipts: Array<Scalars['String']>;
  state: RunState | '%future added value';
};

export enum RunState {
  /** Stopped on a breakpoint */
  Breakpoint = 'BREAKPOINT',
  /** All breakpoints have been processed, and the program has terminated */
  Completed = 'COMPLETED',
}

export type SpendQueryElementInput = {
  /** Target amount for the query. */
  amount: Scalars['U64'];
  /** Identifier of the asset to spend. */
  assetId: Scalars['AssetId'];
  /** The maximum number of currencies for selection. */
  max?: InputMaybe<Scalars['U64']>;
};

export type SubmittedStatus = {
  __typename: 'SubmittedStatus';
  time: Scalars['DateTime'];
};

export type SuccessStatus = {
  __typename: 'SuccessStatus';
  block: Block;
  programState?: Maybe<ProgramState>;
  time: Scalars['DateTime'];
};

export type TimeParameters = {
  /** The time interval between subsequent blocks */
  blockTimeInterval: Scalars['U64'];
  /** The time to set on the first block */
  startTime: Scalars['U64'];
};

export type Transaction = {
  __typename: 'Transaction';
  bytecodeLength?: Maybe<Scalars['U64']>;
  bytecodeWitnessIndex?: Maybe<Scalars['Int']>;
  gasLimit?: Maybe<Scalars['U64']>;
  gasPrice?: Maybe<Scalars['U64']>;
  id: Scalars['TransactionId'];
  inputAssetIds?: Maybe<Array<Scalars['AssetId']>>;
  inputContracts?: Maybe<Array<Contract>>;
  inputs?: Maybe<Array<Input>>;
  isCreate: Scalars['Boolean'];
  isMint: Scalars['Boolean'];
  isScript: Scalars['Boolean'];
  maturity?: Maybe<Scalars['U64']>;
  outputs: Array<Output>;
  /** Return the transaction bytes using canonical encoding */
  rawPayload: Scalars['HexString'];
  receipts?: Maybe<Array<Receipt>>;
  receiptsRoot?: Maybe<Scalars['Bytes32']>;
  salt?: Maybe<Scalars['Salt']>;
  script?: Maybe<Scalars['HexString']>;
  scriptData?: Maybe<Scalars['HexString']>;
  status?: Maybe<TransactionStatus>;
  storageSlots?: Maybe<Array<Scalars['HexString']>>;
  txPointer?: Maybe<Scalars['TxPointer']>;
  witnesses?: Maybe<Array<Scalars['HexString']>>;
};

export type TransactionConnection = {
  __typename: 'TransactionConnection';
  /** A list of edges. */
  edges: Array<TransactionEdge>;
  /** A list of nodes. */
  nodes: Array<Transaction>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type TransactionEdge = {
  __typename: 'TransactionEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node: Transaction;
};

export type TransactionStatus =
  | FailureStatus
  | SubmittedStatus
  | SuccessStatus
  | { __typename?: '%other' };

export type VariableOutput = {
  __typename: 'VariableOutput';
  amount: Scalars['U64'];
  assetId: Scalars['AssetId'];
  to: Scalars['Address'];
};
