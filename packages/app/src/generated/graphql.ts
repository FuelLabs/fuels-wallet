import type { GraphQLClient } from 'graphql-request';
import type { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
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
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Address: { input: string; output: string };
  AssetId: { input: string; output: string };
  BlockId: { input: string; output: string };
  Bytes32: { input: string; output: string };
  ContractId: { input: string; output: string };
  HexString: { input: string; output: string };
  Nonce: { input: string; output: string };
  Salt: { input: string; output: string };
  Signature: { input: string; output: string };
  Tai64Timestamp: { input: string; output: string };
  TransactionId: { input: string; output: string };
  TxPointer: { input: string; output: string };
  U8: { input: string; output: string };
  U32: { input: string; output: string };
  U64: { input: string; output: string };
  UtxoId: { input: string; output: string };
};

export type IBalance = {
  __typename?: 'Balance';
  amount: Scalars['U64']['output'];
  assetId: Scalars['AssetId']['output'];
  owner: Scalars['Address']['output'];
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
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: IBalance;
};

export type IBalanceFilterInput = {
  /** Filter coins based on the `owner` field */
  owner: Scalars['Address']['input'];
};

export type IBlock = {
  __typename?: 'Block';
  consensus: IConsensus;
  header: IHeader;
  id: Scalars['BlockId']['output'];
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
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: IBlock;
};

export type IBreakpoint = {
  contract: Scalars['ContractId']['input'];
  pc: Scalars['U64']['input'];
};

export type IChainInfo = {
  __typename?: 'ChainInfo';
  consensusParameters: IConsensusParameters;
  daHeight: Scalars['U64']['output'];
  gasCosts: IGasCosts;
  latestBlock: IBlock;
  name: Scalars['String']['output'];
};

export type IChangeOutput = {
  __typename?: 'ChangeOutput';
  amount: Scalars['U64']['output'];
  assetId: Scalars['AssetId']['output'];
  to: Scalars['Address']['output'];
};

export type ICoin = {
  __typename?: 'Coin';
  amount: Scalars['U64']['output'];
  assetId: Scalars['AssetId']['output'];
  /** TxPointer - the height of the block this coin was created in */
  blockCreated: Scalars['U32']['output'];
  maturity: Scalars['U32']['output'];
  owner: Scalars['Address']['output'];
  /** TxPointer - the index of the transaction that created this coin */
  txCreatedIdx: Scalars['U64']['output'];
  utxoId: Scalars['UtxoId']['output'];
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
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: ICoin;
};

export type ICoinFilterInput = {
  /** Returns coins only with `asset_id`. */
  assetId: InputMaybe<Scalars['AssetId']['input']>;
  /** Returns coins owned by the `owner`. */
  owner: Scalars['Address']['input'];
};

export type ICoinOutput = {
  __typename?: 'CoinOutput';
  amount: Scalars['U64']['output'];
  assetId: Scalars['AssetId']['output'];
  to: Scalars['Address']['output'];
};

/** The schema analog of the [`coins::CoinType`]. */
export type ICoinType = ICoin | IMessageCoin;

export type IConsensus = IGenesis | IPoAConsensus;

export type IConsensusParameters = {
  __typename?: 'ConsensusParameters';
  baseAssetId: Scalars['AssetId']['output'];
  chainId: Scalars['U64']['output'];
  contractParams: IContractParameters;
  feeParams: IFeeParameters;
  gasCosts: IGasCosts;
  predicateParams: IPredicateParameters;
  scriptParams: IScriptParameters;
  txParams: ITxParameters;
};

export type IContract = {
  __typename?: 'Contract';
  bytecode: Scalars['HexString']['output'];
  id: Scalars['ContractId']['output'];
  salt: Scalars['Salt']['output'];
};

export type IContractBalance = {
  __typename?: 'ContractBalance';
  amount: Scalars['U64']['output'];
  assetId: Scalars['AssetId']['output'];
  contract: Scalars['ContractId']['output'];
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
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: IContractBalance;
};

export type IContractBalanceFilterInput = {
  /** Filter assets based on the `contractId` field */
  contract: Scalars['ContractId']['input'];
};

export type IContractCreated = {
  __typename?: 'ContractCreated';
  contract: IContract;
  stateRoot: Scalars['Bytes32']['output'];
};

export type IContractOutput = {
  __typename?: 'ContractOutput';
  balanceRoot: Scalars['Bytes32']['output'];
  inputIndex: Scalars['Int']['output'];
  stateRoot: Scalars['Bytes32']['output'];
};

export type IContractParameters = {
  __typename?: 'ContractParameters';
  contractMaxSize: Scalars['U64']['output'];
  maxStorageSlots: Scalars['U64']['output'];
};

export type IDependentCost = IHeavyOperation | ILightOperation;

export type IExcludeInput = {
  /** Messages to exclude from the selection. */
  messages: Array<Scalars['Nonce']['input']>;
  /** Utxos to exclude from the selection. */
  utxos: Array<Scalars['UtxoId']['input']>;
};

export type IFailureStatus = {
  __typename?: 'FailureStatus';
  block: IBlock;
  programState: Maybe<IProgramState>;
  reason: Scalars['String']['output'];
  receipts: Array<IReceipt>;
  time: Scalars['Tai64Timestamp']['output'];
  transactionId: Scalars['TransactionId']['output'];
};

export type IFeeParameters = {
  __typename?: 'FeeParameters';
  gasPerByte: Scalars['U64']['output'];
  gasPriceFactor: Scalars['U64']['output'];
};

export type IGasCosts = {
  __typename?: 'GasCosts';
  add: Scalars['U64']['output'];
  addi: Scalars['U64']['output'];
  aloc: Scalars['U64']['output'];
  and: Scalars['U64']['output'];
  andi: Scalars['U64']['output'];
  bal: Scalars['U64']['output'];
  bhei: Scalars['U64']['output'];
  bhsh: Scalars['U64']['output'];
  burn: Scalars['U64']['output'];
  call: IDependentCost;
  cb: Scalars['U64']['output'];
  ccp: IDependentCost;
  cfei: Scalars['U64']['output'];
  cfsi: Scalars['U64']['output'];
  contractRoot: IDependentCost;
  croo: Scalars['U64']['output'];
  csiz: IDependentCost;
  div: Scalars['U64']['output'];
  divi: Scalars['U64']['output'];
  eck1: Scalars['U64']['output'];
  ecr1: Scalars['U64']['output'];
  ed19: Scalars['U64']['output'];
  eq: Scalars['U64']['output'];
  exp: Scalars['U64']['output'];
  expi: Scalars['U64']['output'];
  flag: Scalars['U64']['output'];
  gm: Scalars['U64']['output'];
  gt: Scalars['U64']['output'];
  gtf: Scalars['U64']['output'];
  ji: Scalars['U64']['output'];
  jmp: Scalars['U64']['output'];
  jmpb: Scalars['U64']['output'];
  jmpf: Scalars['U64']['output'];
  jne: Scalars['U64']['output'];
  jneb: Scalars['U64']['output'];
  jnef: Scalars['U64']['output'];
  jnei: Scalars['U64']['output'];
  jnzb: Scalars['U64']['output'];
  jnzf: Scalars['U64']['output'];
  jnzi: Scalars['U64']['output'];
  k256: IDependentCost;
  lb: Scalars['U64']['output'];
  ldc: IDependentCost;
  log: Scalars['U64']['output'];
  logd: IDependentCost;
  lt: Scalars['U64']['output'];
  lw: Scalars['U64']['output'];
  mcl: IDependentCost;
  mcli: IDependentCost;
  mcp: IDependentCost;
  mcpi: IDependentCost;
  meq: IDependentCost;
  mint: Scalars['U64']['output'];
  mldv: Scalars['U64']['output'];
  mlog: Scalars['U64']['output'];
  modOp: Scalars['U64']['output'];
  modi: Scalars['U64']['output'];
  moveOp: Scalars['U64']['output'];
  movi: Scalars['U64']['output'];
  mroo: Scalars['U64']['output'];
  mul: Scalars['U64']['output'];
  muli: Scalars['U64']['output'];
  newStoragePerByte: Scalars['U64']['output'];
  noop: Scalars['U64']['output'];
  not: Scalars['U64']['output'];
  or: Scalars['U64']['output'];
  ori: Scalars['U64']['output'];
  poph: Scalars['U64']['output'];
  popl: Scalars['U64']['output'];
  pshh: Scalars['U64']['output'];
  pshl: Scalars['U64']['output'];
  ret: Scalars['U64']['output'];
  retd: IDependentCost;
  rvrt: Scalars['U64']['output'];
  s256: IDependentCost;
  sb: Scalars['U64']['output'];
  scwq: IDependentCost;
  sll: Scalars['U64']['output'];
  slli: Scalars['U64']['output'];
  smo: IDependentCost;
  srl: Scalars['U64']['output'];
  srli: Scalars['U64']['output'];
  srw: Scalars['U64']['output'];
  srwq: IDependentCost;
  stateRoot: IDependentCost;
  sub: Scalars['U64']['output'];
  subi: Scalars['U64']['output'];
  sw: Scalars['U64']['output'];
  sww: Scalars['U64']['output'];
  swwq: IDependentCost;
  time: Scalars['U64']['output'];
  tr: Scalars['U64']['output'];
  tro: Scalars['U64']['output'];
  vmInitialization: IDependentCost;
  wdam: Scalars['U64']['output'];
  wdcm: Scalars['U64']['output'];
  wddv: Scalars['U64']['output'];
  wdmd: Scalars['U64']['output'];
  wdml: Scalars['U64']['output'];
  wdmm: Scalars['U64']['output'];
  wdop: Scalars['U64']['output'];
  wqam: Scalars['U64']['output'];
  wqcm: Scalars['U64']['output'];
  wqdv: Scalars['U64']['output'];
  wqmd: Scalars['U64']['output'];
  wqml: Scalars['U64']['output'];
  wqmm: Scalars['U64']['output'];
  wqop: Scalars['U64']['output'];
  xor: Scalars['U64']['output'];
  xori: Scalars['U64']['output'];
};

export type IGenesis = {
  __typename?: 'Genesis';
  /**
   * The chain configs define what consensus type to use, what settlement layer to use,
   * rules of block validity, etc.
   */
  chainConfigHash: Scalars['Bytes32']['output'];
  /** The Binary Merkle Tree root of all genesis coins. */
  coinsRoot: Scalars['Bytes32']['output'];
  /** The Binary Merkle Tree root of state, balances, contracts code hash of each contract. */
  contractsRoot: Scalars['Bytes32']['output'];
  /** The Binary Merkle Tree root of all genesis messages. */
  messagesRoot: Scalars['Bytes32']['output'];
};

export type IHeader = {
  __typename?: 'Header';
  /** Hash of the application header. */
  applicationHash: Scalars['Bytes32']['output'];
  /** The layer 1 height of messages and events to include since the last layer 1 block number. */
  daHeight: Scalars['U64']['output'];
  /** Fuel block height. */
  height: Scalars['U32']['output'];
  /** Hash of the header */
  id: Scalars['BlockId']['output'];
  /** Number of message receipts in this block. */
  messageReceiptCount: Scalars['U64']['output'];
  /** Merkle root of message receipts in this block. */
  messageReceiptRoot: Scalars['Bytes32']['output'];
  /** Merkle root of all previous block header hashes. */
  prevRoot: Scalars['Bytes32']['output'];
  /** The block producer time. */
  time: Scalars['Tai64Timestamp']['output'];
  /** Number of transactions in this block. */
  transactionsCount: Scalars['U64']['output'];
  /** Merkle root of transactions. */
  transactionsRoot: Scalars['Bytes32']['output'];
};

export type IHeavyOperation = {
  __typename?: 'HeavyOperation';
  base: Scalars['U64']['output'];
  gasPerUnit: Scalars['U64']['output'];
};

export type IInput = IInputCoin | IInputContract | IInputMessage;

export type IInputCoin = {
  __typename?: 'InputCoin';
  amount: Scalars['U64']['output'];
  assetId: Scalars['AssetId']['output'];
  maturity: Scalars['U32']['output'];
  owner: Scalars['Address']['output'];
  predicate: Scalars['HexString']['output'];
  predicateData: Scalars['HexString']['output'];
  predicateGasUsed: Scalars['U64']['output'];
  txPointer: Scalars['TxPointer']['output'];
  utxoId: Scalars['UtxoId']['output'];
  witnessIndex: Scalars['Int']['output'];
};

export type IInputContract = {
  __typename?: 'InputContract';
  balanceRoot: Scalars['Bytes32']['output'];
  contract: IContract;
  stateRoot: Scalars['Bytes32']['output'];
  txPointer: Scalars['TxPointer']['output'];
  utxoId: Scalars['UtxoId']['output'];
};

export type IInputMessage = {
  __typename?: 'InputMessage';
  amount: Scalars['U64']['output'];
  data: Scalars['HexString']['output'];
  nonce: Scalars['Nonce']['output'];
  predicate: Scalars['HexString']['output'];
  predicateData: Scalars['HexString']['output'];
  predicateGasUsed: Scalars['U64']['output'];
  recipient: Scalars['Address']['output'];
  sender: Scalars['Address']['output'];
  witnessIndex: Scalars['Int']['output'];
};

export type ILightOperation = {
  __typename?: 'LightOperation';
  base: Scalars['U64']['output'];
  unitsPerGas: Scalars['U64']['output'];
};

export type IMerkleProof = {
  __typename?: 'MerkleProof';
  proofIndex: Scalars['U64']['output'];
  proofSet: Array<Scalars['Bytes32']['output']>;
};

export type IMessage = {
  __typename?: 'Message';
  amount: Scalars['U64']['output'];
  daHeight: Scalars['U64']['output'];
  data: Scalars['HexString']['output'];
  nonce: Scalars['Nonce']['output'];
  recipient: Scalars['Address']['output'];
  sender: Scalars['Address']['output'];
};

export type IMessageCoin = {
  __typename?: 'MessageCoin';
  amount: Scalars['U64']['output'];
  assetId: Scalars['AssetId']['output'];
  daHeight: Scalars['U64']['output'];
  nonce: Scalars['Nonce']['output'];
  recipient: Scalars['Address']['output'];
  sender: Scalars['Address']['output'];
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
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: IMessage;
};

export type IMessageProof = {
  __typename?: 'MessageProof';
  amount: Scalars['U64']['output'];
  blockProof: IMerkleProof;
  commitBlockHeader: IHeader;
  data: Scalars['HexString']['output'];
  messageBlockHeader: IHeader;
  messageProof: IMerkleProof;
  nonce: Scalars['Nonce']['output'];
  recipient: Scalars['Address']['output'];
  sender: Scalars['Address']['output'];
};

export enum IMessageState {
  NotFound = 'NOT_FOUND',
  Spent = 'SPENT',
  Unspent = 'UNSPENT',
}

export type IMessageStatus = {
  __typename?: 'MessageStatus';
  state: IMessageState;
};

export type IMutation = {
  __typename?: 'Mutation';
  continueTx: IRunResult;
  /** Execute a dry-run of the transaction using a fork of current state, no changes are committed. */
  dryRun: Array<IReceipt>;
  endSession: Scalars['Boolean']['output'];
  execute: Scalars['Boolean']['output'];
  /**
   * Sequentially produces `blocks_to_produce` blocks. The first block starts with
   * `start_timestamp`. If the block production in the [`crate::service::Config`] is
   * `Trigger::Interval { block_time }`, produces blocks with `block_time ` intervals between
   * them. The `start_timestamp` is the timestamp in seconds.
   */
  produceBlocks: Scalars['U32']['output'];
  reset: Scalars['Boolean']['output'];
  setBreakpoint: Scalars['Boolean']['output'];
  setSingleStepping: Scalars['Boolean']['output'];
  startSession: Scalars['ID']['output'];
  startTx: IRunResult;
  /**
   * Submits transaction to the `TxPool`.
   *
   * Returns submitted transaction if the transaction is included in the `TxPool` without problems.
   */
  submit: ITransaction;
};

export type IMutationContinueTxArgs = {
  id: Scalars['ID']['input'];
};

export type IMutationDryRunArgs = {
  tx: Scalars['HexString']['input'];
  utxoValidation: InputMaybe<Scalars['Boolean']['input']>;
};

export type IMutationEndSessionArgs = {
  id: Scalars['ID']['input'];
};

export type IMutationExecuteArgs = {
  id: Scalars['ID']['input'];
  op: Scalars['String']['input'];
};

export type IMutationProduceBlocksArgs = {
  blocksToProduce: Scalars['U32']['input'];
  startTimestamp: InputMaybe<Scalars['Tai64Timestamp']['input']>;
};

export type IMutationResetArgs = {
  id: Scalars['ID']['input'];
};

export type IMutationSetBreakpointArgs = {
  breakpoint: IBreakpoint;
  id: Scalars['ID']['input'];
};

export type IMutationSetSingleSteppingArgs = {
  enable: Scalars['Boolean']['input'];
  id: Scalars['ID']['input'];
};

export type IMutationStartTxArgs = {
  id: Scalars['ID']['input'];
  txJson: Scalars['String']['input'];
};

export type IMutationSubmitArgs = {
  tx: Scalars['HexString']['input'];
};

export type INodeInfo = {
  __typename?: 'NodeInfo';
  maxDepth: Scalars['U64']['output'];
  maxTx: Scalars['U64']['output'];
  minGasPrice: Scalars['U64']['output'];
  nodeVersion: Scalars['String']['output'];
  peers: Array<IPeerInfo>;
  utxoValidation: Scalars['Boolean']['output'];
  vmBacktrace: Scalars['Boolean']['output'];
};

export type IOutput =
  | IChangeOutput
  | ICoinOutput
  | IContractCreated
  | IContractOutput
  | IVariableOutput;

/**
 * A separate `Breakpoint` type to be used as an output, as a single
 * type cannot act as both input and output type in async-graphql
 */
export type IOutputBreakpoint = {
  __typename?: 'OutputBreakpoint';
  contract: Scalars['ContractId']['output'];
  pc: Scalars['U64']['output'];
};

/** Information about pagination in a connection */
export type IPageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor: Maybe<Scalars['String']['output']>;
};

export type IPeerInfo = {
  __typename?: 'PeerInfo';
  /** The advertised multi-addrs that can be used to connect to this peer */
  addresses: Array<Scalars['String']['output']>;
  /** The internal fuel p2p reputation of this peer */
  appScore: Scalars['Float']['output'];
  /** The last reported height of the peer */
  blockHeight: Maybe<Scalars['U32']['output']>;
  /** The self-reported version of the client the peer is using */
  clientVersion: Maybe<Scalars['String']['output']>;
  /** The libp2p peer id */
  id: Scalars['String']['output'];
  /** The last heartbeat from this peer in unix epoch time ms */
  lastHeartbeatMs: Scalars['U64']['output'];
};

export type IPoAConsensus = {
  __typename?: 'PoAConsensus';
  /** Gets the signature of the block produced by `PoA` consensus. */
  signature: Scalars['Signature']['output'];
};

export type IPolicies = {
  __typename?: 'Policies';
  gasPrice: Maybe<Scalars['U64']['output']>;
  maturity: Maybe<Scalars['U32']['output']>;
  maxFee: Maybe<Scalars['U64']['output']>;
  witnessLimit: Maybe<Scalars['U64']['output']>;
};

export type IPredicateParameters = {
  __typename?: 'PredicateParameters';
  maxGasPerPredicate: Scalars['U64']['output'];
  maxMessageDataLength: Scalars['U64']['output'];
  maxPredicateDataLength: Scalars['U64']['output'];
  maxPredicateLength: Scalars['U64']['output'];
};

export type IProgramState = {
  __typename?: 'ProgramState';
  data: Scalars['HexString']['output'];
  returnType: IReturnType;
};

export type IQuery = {
  __typename?: 'Query';
  balance: IBalance;
  balances: IBalanceConnection;
  block: Maybe<IBlock>;
  blocks: IBlockConnection;
  chain: IChainInfo;
  /** Gets the coin by `utxo_id`. */
  coin: Maybe<ICoin>;
  /** Gets all unspent coins of some `owner` maybe filtered with by `asset_id` per page. */
  coins: ICoinConnection;
  /**
   * For each `query_per_asset`, get some spendable coins(of asset specified by the query) owned by
   * `owner` that add up at least the query amount. The returned coins can be spent.
   * The number of coins is optimized to prevent dust accumulation.
   *
   * The query supports excluding and maximum the number of coins.
   *
   * Returns:
   * The list of spendable coins per asset from the query. The length of the result is
   * the same as the length of `query_per_asset`. The ordering of assets and `query_per_asset`
   * is the same.
   */
  coinsToSpend: Array<Array<ICoinType>>;
  contract: Maybe<IContract>;
  contractBalance: IContractBalance;
  contractBalances: IContractBalanceConnection;
  /** Estimate the predicate gas for the provided transaction */
  estimatePredicates: ITransaction;
  /** Returns true when the GraphQL API is serving requests. */
  health: Scalars['Boolean']['output'];
  memory: Scalars['String']['output'];
  messageProof: Maybe<IMessageProof>;
  messageStatus: IMessageStatus;
  messages: IMessageConnection;
  nodeInfo: INodeInfo;
  register: Scalars['U64']['output'];
  transaction: Maybe<ITransaction>;
  transactions: ITransactionConnection;
  transactionsByOwner: ITransactionConnection;
};

export type IQueryBalanceArgs = {
  assetId: Scalars['AssetId']['input'];
  owner: Scalars['Address']['input'];
};

export type IQueryBalancesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  filter: IBalanceFilterInput;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};

export type IQueryBlockArgs = {
  height: InputMaybe<Scalars['U32']['input']>;
  id: InputMaybe<Scalars['BlockId']['input']>;
};

export type IQueryBlocksArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};

export type IQueryCoinArgs = {
  utxoId: Scalars['UtxoId']['input'];
};

export type IQueryCoinsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  filter: ICoinFilterInput;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};

export type IQueryCoinsToSpendArgs = {
  excludedIds: InputMaybe<IExcludeInput>;
  owner: Scalars['Address']['input'];
  queryPerAsset: Array<ISpendQueryElementInput>;
};

export type IQueryContractArgs = {
  id: Scalars['ContractId']['input'];
};

export type IQueryContractBalanceArgs = {
  asset: Scalars['AssetId']['input'];
  contract: Scalars['ContractId']['input'];
};

export type IQueryContractBalancesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  filter: IContractBalanceFilterInput;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};

export type IQueryEstimatePredicatesArgs = {
  tx: Scalars['HexString']['input'];
};

export type IQueryMemoryArgs = {
  id: Scalars['ID']['input'];
  size: Scalars['U32']['input'];
  start: Scalars['U32']['input'];
};

export type IQueryMessageProofArgs = {
  commitBlockHeight: InputMaybe<Scalars['U32']['input']>;
  commitBlockId: InputMaybe<Scalars['BlockId']['input']>;
  nonce: Scalars['Nonce']['input'];
  transactionId: Scalars['TransactionId']['input'];
};

export type IQueryMessageStatusArgs = {
  nonce: Scalars['Nonce']['input'];
};

export type IQueryMessagesArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  owner: InputMaybe<Scalars['Address']['input']>;
};

export type IQueryRegisterArgs = {
  id: Scalars['ID']['input'];
  register: Scalars['U32']['input'];
};

export type IQueryTransactionArgs = {
  id: Scalars['TransactionId']['input'];
};

export type IQueryTransactionsArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
};

export type IQueryTransactionsByOwnerArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  before: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  owner: Scalars['Address']['input'];
};

export type IReceipt = {
  __typename?: 'Receipt';
  amount: Maybe<Scalars['U64']['output']>;
  assetId: Maybe<Scalars['AssetId']['output']>;
  contract: Maybe<IContract>;
  contractId: Maybe<Scalars['ContractId']['output']>;
  data: Maybe<Scalars['HexString']['output']>;
  digest: Maybe<Scalars['Bytes32']['output']>;
  gas: Maybe<Scalars['U64']['output']>;
  gasUsed: Maybe<Scalars['U64']['output']>;
  is: Maybe<Scalars['U64']['output']>;
  len: Maybe<Scalars['U64']['output']>;
  nonce: Maybe<Scalars['Nonce']['output']>;
  param1: Maybe<Scalars['U64']['output']>;
  param2: Maybe<Scalars['U64']['output']>;
  pc: Maybe<Scalars['U64']['output']>;
  ptr: Maybe<Scalars['U64']['output']>;
  ra: Maybe<Scalars['U64']['output']>;
  rb: Maybe<Scalars['U64']['output']>;
  rc: Maybe<Scalars['U64']['output']>;
  rd: Maybe<Scalars['U64']['output']>;
  reason: Maybe<Scalars['U64']['output']>;
  receiptType: IReceiptType;
  recipient: Maybe<Scalars['Address']['output']>;
  result: Maybe<Scalars['U64']['output']>;
  sender: Maybe<Scalars['Address']['output']>;
  subId: Maybe<Scalars['Bytes32']['output']>;
  to: Maybe<IContract>;
  toAddress: Maybe<Scalars['Address']['output']>;
  val: Maybe<Scalars['U64']['output']>;
};

export enum IReceiptType {
  Burn = 'BURN',
  Call = 'CALL',
  Log = 'LOG',
  LogData = 'LOG_DATA',
  MessageOut = 'MESSAGE_OUT',
  Mint = 'MINT',
  Panic = 'PANIC',
  Return = 'RETURN',
  ReturnData = 'RETURN_DATA',
  Revert = 'REVERT',
  ScriptResult = 'SCRIPT_RESULT',
  Transfer = 'TRANSFER',
  TransferOut = 'TRANSFER_OUT',
}

export enum IReturnType {
  Return = 'RETURN',
  ReturnData = 'RETURN_DATA',
  Revert = 'REVERT',
}

export type IRunResult = {
  __typename?: 'RunResult';
  breakpoint: Maybe<IOutputBreakpoint>;
  jsonReceipts: Array<Scalars['String']['output']>;
  state: IRunState;
};

export enum IRunState {
  /** Stopped on a breakpoint */
  Breakpoint = 'BREAKPOINT',
  /** All breakpoints have been processed, and the program has terminated */
  Completed = 'COMPLETED',
}

export type IScriptParameters = {
  __typename?: 'ScriptParameters';
  maxScriptDataLength: Scalars['U64']['output'];
  maxScriptLength: Scalars['U64']['output'];
};

export type ISpendQueryElementInput = {
  /** Target amount for the query. */
  amount: Scalars['U64']['input'];
  /** Identifier of the asset to spend. */
  assetId: Scalars['AssetId']['input'];
  /** The maximum number of currencies for selection. */
  max: InputMaybe<Scalars['U32']['input']>;
};

export type ISqueezedOutStatus = {
  __typename?: 'SqueezedOutStatus';
  reason: Scalars['String']['output'];
};

export type ISubmittedStatus = {
  __typename?: 'SubmittedStatus';
  time: Scalars['Tai64Timestamp']['output'];
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
  /** Submits transaction to the `TxPool` and await either confirmation or failure. */
  submitAndAwait: ITransactionStatus;
};

export type ISubscriptionStatusChangeArgs = {
  id: Scalars['TransactionId']['input'];
};

export type ISubscriptionSubmitAndAwaitArgs = {
  tx: Scalars['HexString']['input'];
};

export type ISuccessStatus = {
  __typename?: 'SuccessStatus';
  block: IBlock;
  programState: Maybe<IProgramState>;
  receipts: Array<IReceipt>;
  time: Scalars['Tai64Timestamp']['output'];
  transactionId: Scalars['TransactionId']['output'];
};

export type ITransaction = {
  __typename?: 'Transaction';
  bytecodeLength: Maybe<Scalars['U64']['output']>;
  bytecodeWitnessIndex: Maybe<Scalars['Int']['output']>;
  gasPrice: Maybe<Scalars['U64']['output']>;
  id: Scalars['TransactionId']['output'];
  inputAssetIds: Maybe<Array<Scalars['AssetId']['output']>>;
  inputContract: Maybe<IInputContract>;
  inputContracts: Maybe<Array<IContract>>;
  inputs: Maybe<Array<IInput>>;
  isCreate: Scalars['Boolean']['output'];
  isMint: Scalars['Boolean']['output'];
  isScript: Scalars['Boolean']['output'];
  maturity: Maybe<Scalars['U32']['output']>;
  mintAmount: Maybe<Scalars['U64']['output']>;
  mintAssetId: Maybe<Scalars['AssetId']['output']>;
  outputContract: Maybe<IContractOutput>;
  outputs: Array<IOutput>;
  policies: Maybe<IPolicies>;
  /** Return the transaction bytes using canonical encoding */
  rawPayload: Scalars['HexString']['output'];
  receipts: Maybe<Array<IReceipt>>;
  receiptsRoot: Maybe<Scalars['Bytes32']['output']>;
  salt: Maybe<Scalars['Salt']['output']>;
  script: Maybe<Scalars['HexString']['output']>;
  scriptData: Maybe<Scalars['HexString']['output']>;
  scriptGasLimit: Maybe<Scalars['U64']['output']>;
  status: Maybe<ITransactionStatus>;
  storageSlots: Maybe<Array<Scalars['HexString']['output']>>;
  txPointer: Maybe<Scalars['TxPointer']['output']>;
  witnesses: Maybe<Array<Scalars['HexString']['output']>>;
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
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: ITransaction;
};

export type ITransactionStatus =
  | IFailureStatus
  | ISqueezedOutStatus
  | ISubmittedStatus
  | ISuccessStatus;

export type ITxParameters = {
  __typename?: 'TxParameters';
  maxGasPerTx: Scalars['U64']['output'];
  maxInputs: Scalars['U8']['output'];
  maxOutputs: Scalars['U8']['output'];
  maxSize: Scalars['U64']['output'];
  maxWitnesses: Scalars['U32']['output'];
};

export type IVariableOutput = {
  __typename?: 'VariableOutput';
  amount: Scalars['U64']['output'];
  assetId: Scalars['AssetId']['output'];
  to: Scalars['Address']['output'];
};

export type IAddressTransactionsQueryVariables = Exact<{
  first: InputMaybe<Scalars['Int']['input']>;
  owner: Scalars['Address']['input'];
}>;

export type IAddressTransactionsQuery = {
  __typename?: 'Query';
  transactionsByOwner: {
    __typename?: 'TransactionConnection';
    edges: Array<{
      __typename?: 'TransactionEdge';
      node: {
        __typename?: 'Transaction';
        id: string;
        rawPayload: string;
        gasPrice: string | null;
        receipts: Array<{
          __typename?: 'Receipt';
          pc: string | null;
          is: string | null;
          toAddress: string | null;
          amount: string | null;
          assetId: string | null;
          gas: string | null;
          param1: string | null;
          param2: string | null;
          val: string | null;
          ptr: string | null;
          digest: string | null;
          reason: string | null;
          ra: string | null;
          rb: string | null;
          rc: string | null;
          rd: string | null;
          len: string | null;
          receiptType: IReceiptType;
          result: string | null;
          gasUsed: string | null;
          data: string | null;
          sender: string | null;
          recipient: string | null;
          nonce: string | null;
          contractId: string | null;
          subId: string | null;
          contract: {
            __typename?: 'Contract';
            id: string;
            bytecode: string;
          } | null;
          to: { __typename?: 'Contract'; id: string; bytecode: string } | null;
        }> | null;
        status:
          | {
              __typename?: 'FailureStatus';
              time: string;
              reason: string;
              type: 'FailureStatus';
              block: { __typename?: 'Block'; id: string };
            }
          | { __typename?: 'SqueezedOutStatus'; type: 'SqueezedOutStatus' }
          | {
              __typename?: 'SubmittedStatus';
              time: string;
              type: 'SubmittedStatus';
            }
          | {
              __typename?: 'SuccessStatus';
              time: string;
              type: 'SuccessStatus';
              block: { __typename?: 'Block'; id: string };
              programState: {
                __typename?: 'ProgramState';
                returnType: IReturnType;
                data: string;
              } | null;
            }
          | null;
      };
    }>;
  };
};

export type ITransactionFragment = {
  __typename?: 'Transaction';
  id: string;
  rawPayload: string;
  gasPrice: string | null;
  receipts: Array<{
    __typename?: 'Receipt';
    pc: string | null;
    is: string | null;
    toAddress: string | null;
    amount: string | null;
    assetId: string | null;
    gas: string | null;
    param1: string | null;
    param2: string | null;
    val: string | null;
    ptr: string | null;
    digest: string | null;
    reason: string | null;
    ra: string | null;
    rb: string | null;
    rc: string | null;
    rd: string | null;
    len: string | null;
    receiptType: IReceiptType;
    result: string | null;
    gasUsed: string | null;
    data: string | null;
    sender: string | null;
    recipient: string | null;
    nonce: string | null;
    contractId: string | null;
    subId: string | null;
    contract: { __typename?: 'Contract'; id: string; bytecode: string } | null;
    to: { __typename?: 'Contract'; id: string; bytecode: string } | null;
  }> | null;
  status:
    | {
        __typename?: 'FailureStatus';
        time: string;
        reason: string;
        type: 'FailureStatus';
        block: { __typename?: 'Block'; id: string };
      }
    | { __typename?: 'SqueezedOutStatus'; type: 'SqueezedOutStatus' }
    | { __typename?: 'SubmittedStatus'; time: string; type: 'SubmittedStatus' }
    | {
        __typename?: 'SuccessStatus';
        time: string;
        type: 'SuccessStatus';
        block: { __typename?: 'Block'; id: string };
        programState: {
          __typename?: 'ProgramState';
          returnType: IReturnType;
          data: string;
        } | null;
      }
    | null;
};

export type IContractFragmentFragment = {
  __typename?: 'Contract';
  id: string;
  bytecode: string;
};

export type IReceiptFragment = {
  __typename?: 'Receipt';
  pc: string | null;
  is: string | null;
  toAddress: string | null;
  amount: string | null;
  assetId: string | null;
  gas: string | null;
  param1: string | null;
  param2: string | null;
  val: string | null;
  ptr: string | null;
  digest: string | null;
  reason: string | null;
  ra: string | null;
  rb: string | null;
  rc: string | null;
  rd: string | null;
  len: string | null;
  receiptType: IReceiptType;
  result: string | null;
  gasUsed: string | null;
  data: string | null;
  sender: string | null;
  recipient: string | null;
  nonce: string | null;
  contractId: string | null;
  subId: string | null;
  contract: { __typename?: 'Contract'; id: string; bytecode: string } | null;
  to: { __typename?: 'Contract'; id: string; bytecode: string } | null;
};

export const gqlOperations = {
  Query: {
    AddressTransactions: 'AddressTransactions',
  },
  Fragment: {
    transaction: 'transaction',
    contractFragment: 'contractFragment',
    receipt: 'receipt',
  },
};
export const ContractFragmentFragmentDoc = gql`
  fragment contractFragment on Contract {
    id
    bytecode
  }
`;
export const ReceiptFragmentDoc = gql`
  fragment receipt on Receipt {
    contract {
      ...contractFragment
    }
    pc
    is
    to {
      ...contractFragment
    }
    toAddress
    amount
    assetId
    gas
    param1
    param2
    val
    ptr
    digest
    reason
    ra
    rb
    rc
    rd
    len
    receiptType
    result
    gasUsed
    data
    sender
    recipient
    nonce
    contractId
    subId
  }
  ${ContractFragmentFragmentDoc}
`;
export const TransactionFragmentDoc = gql`
  fragment transaction on Transaction {
    id
    rawPayload
    gasPrice
    receipts {
      ...receipt
    }
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
  ${ReceiptFragmentDoc}
`;
export const AddressTransactionsDocument = gql`
  query AddressTransactions($first: Int, $owner: Address!) {
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
      requestHeaders?: GraphQLClientRequestHeaders
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
