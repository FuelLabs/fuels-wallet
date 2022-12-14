import { AddressType } from '@fuel-wallet/types';
import type {
  BN,
  BNInput,
  Input,
  InputCoin,
  InputContract,
  Output,
  OutputCoin,
  OutputContract,
  OutputContractCreated,
  Transaction,
  TransactionRequestLike,
  TransactionResponse,
  TransactionResultCallReceipt,
  TransactionResultReceipt,
} from 'fuels';
import {
  calculatePriceWithFactor,
  getGasUsedFromReceipts,
  ReceiptType,
  TransactionType,
  bn,
  TransactionCoder,
  InputType,
  OutputType,
} from 'fuels';

export enum Operations {
  payBlockProducer = 'Pay network fee to block producer',
  contractCreated = 'Contract created',
  transfer = 'Transfer asset',
  contractCall = 'Contract call',
}

// ANCHOR: START
// TODO: this GqlTransactionStatus is temporary, should be replaced once TS SDK starts to return correct type
export type GqlTransactionStatus =
  | 'FailureStatus'
  | 'SubmittedStatus'
  | 'SuccessStatus';
// ANCHOR: END

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

export function toJSON<T extends TransactionRequestLike | TransactionResponse>(
  tx: T
) {
  return Object.entries(tx).reduce((obj, [key, value]) => {
    const val =
      value instanceof Uint8Array ? value : JSON.parse(JSON.stringify(value));
    return { ...obj, [key]: val };
  }, {} as T);
}

export const getStatus = (
  gqlStatus?: GqlTransactionStatus
): Status | undefined => {
  switch (gqlStatus) {
    case 'FailureStatus':
      return Status.failure;
    case 'SuccessStatus':
      return Status.success;
    case 'SubmittedStatus':
      return Status.pending;
    default:
      return undefined;
  }
};

export function getInputsByType<T = Input>(tx?: Transaction, type?: InputType) {
  return (tx?.inputs ?? []).filter((i) => i.type === type) as T[];
}

export function getInputsCoin(tx?: Transaction) {
  return getInputsByType<InputCoin>(tx, InputType.Coin);
}

export function getInputContractFromIndex(
  tx?: Transaction,
  inputIndex?: number
): InputContract | undefined {
  if (inputIndex == null) return undefined;

  const contractInput = tx?.inputs?.[inputIndex];

  if (!contractInput) return undefined;
  if (contractInput.type !== InputType.Contract) {
    throw new Error('Contract input should be of type Contract');
  }

  return contractInput as InputContract;
}

export function getFromAddress(tx?: Transaction) {
  return getInputsCoin(tx)[0]?.owner.toString();
}

export function getOutputsByType<T = Output>(
  tx?: Transaction,
  type?: OutputType
) {
  return (tx?.outputs ?? []).filter((o) => o.type === type) as T[];
}

export function getOutputsCoin(tx?: Transaction) {
  return getOutputsByType<OutputCoin>(tx, OutputType.Coin);
}

export function getOutputsContract(tx?: Transaction) {
  return getOutputsByType<OutputContract>(tx, OutputType.Contract);
}

export function getOutputsContractCreated(tx?: Transaction) {
  return getOutputsByType<OutputContractCreated>(
    tx,
    OutputType.ContractCreated
  );
}

export function getOutputsChange(tx?: Transaction) {
  return getOutputsByType<OutputCoin>(tx, OutputType.Change);
}

export function getReceiptsByType<T = TransactionResultReceipt>(
  receipts?: TransactionResultReceipt[],
  type?: ReceiptType
) {
  return (receipts ?? []).filter((r) => r.type === type) as T[];
}

export function getReceiptsCallResult(receipts?: TransactionResultReceipt[]) {
  return getReceiptsByType<TransactionResultCallReceipt>(
    receipts,
    ReceiptType.Call
  );
}

export function getType(transactionType?: TransactionType): Type | undefined {
  switch (transactionType) {
    case TransactionType.Mint:
      return Type.mint;
    case TransactionType.Create:
      return Type.create;
    case TransactionType.Script:
      return Type.script;
    default:
      return undefined;
  }
}

export type Flags = {
  isTypeMint: boolean;
  isTypeCreate: boolean;
  isTypeScript: boolean;
  isStatusPending: boolean;
  isStatusSuccess: boolean;
  isStatusFailure: boolean;
};

export function getFlags(tx?: Transaction, status?: Status): Flags {
  const type = getType(tx?.type);

  return {
    isTypeMint: type === Type.mint,
    isTypeCreate: type === Type.create,
    isTypeScript: type === Type.script,
    isStatusPending: status === Status.pending,
    isStatusSuccess: status === Status.success,
    isStatusFailure: status === Status.failure,
  };
}

export type Operation = {
  name?: string;
  from?: Address;
  to?: Address;
  assetsSent?: Array<Coin>;
};

export function addOperation(operations: Operation[], toAdd: Operation) {
  // control if the added operation is stacked or not
  let isStacked;
  const ops = operations.map((op) => {
    const isAddingSameOperation =
      (!op.name && !toAdd.name) || op.name === toAdd.name;
    const isAddingSameFrom =
      op.from?.address === toAdd.from?.address &&
      op.from?.type === toAdd.from?.type;
    const isAddingSameTo =
      op.to?.address === toAdd.to?.address && op.to?.type === toAdd.to?.type;

    if (isAddingSameOperation && isAddingSameFrom && isAddingSameTo) {
      isStacked = true;

      // if it's not adding any assets, just return the original operation
      if (!toAdd.assetsSent?.length) return op;

      // if the original operation doesn't have any assets, just return the toAdd assets
      if (!op.assetsSent?.length)
        return { ...op, assetsSent: toAdd.assetsSent };

      // if both have assets, merge them
      const opAssetsSent = op.assetsSent.map((opAsset) => {
        const toAddAsset = toAdd.assetsSent?.find(
          (b) => b.assetId === opAsset.assetId
        );
        if (!toAddAsset) return opAsset;

        return {
          ...opAsset,
          amount: bn(opAsset.amount).add(toAddAsset.amount),
        };
      });
      const newAssetsSent = toAdd.assetsSent.filter(
        (b) => !opAssetsSent.find((a) => a.assetId === b.assetId)
      );
      const mergedAssetsSent = [...opAssetsSent, ...newAssetsSent];

      return {
        ...op,
        assetsSent: mergedAssetsSent,
      };
    }

    return op;
  });

  if (isStacked) return ops;

  return [...operations, toAdd];
}

export function getContractCreatedOperations(tx?: Transaction): Operation[] {
  const contractCreatedOutputs = getOutputsContractCreated(tx);
  const contractCreatedOperations = contractCreatedOutputs.reduce(
    (prev, contractCreatedOutput) => {
      const operations = addOperation(prev, {
        name: Operations.contractCreated,
        from: {
          type: AddressType.account,
          address: getFromAddress(tx),
        },
        to: {
          type: AddressType.contract,
          address: contractCreatedOutput?.contractId || '',
        },
      });

      return operations;
    },
    [] as Operation[]
  );

  return contractCreatedOperations;
}

export function getTransferOperations(tx?: Transaction): Operation[] {
  const coinInputs = getInputsCoin(tx);
  const coinOutputs = getOutputsCoin(tx);

  const operations = coinInputs.reduce((prevInput, input) => {
    const outputOps = coinOutputs.reduce((prevOutput, output) => {
      const isSameAsset = input.assetId === output.assetId;
      const isDifPublicKey = input.owner.toString() !== output.to.toString();

      if (isSameAsset && isDifPublicKey) {
        return addOperation(prevOutput, {
          name: Operations.transfer,
          from: {
            type: AddressType.account,
            address: input.owner.toString(),
          },
          to: {
            type: AddressType.account,
            address: output.to.toString(),
          },
          assetsSent: [
            {
              assetId: output.assetId.toString(),
              amount: output.amount,
            },
          ],
        });
      }

      return prevOutput;
    }, prevInput);

    return outputOps;
  }, [] as Operation[]);

  return operations;
}

export function getPayProducerOperations(tx?: Transaction): Operation[] {
  const coinOutputs = getOutputsCoin(tx);
  const payProducerOperations = coinOutputs.reduce((prev, output) => {
    const operations = addOperation(prev, {
      name: Operations.payBlockProducer,
      from: {
        type: AddressType.account,
        address: 'Network',
      },
      to: {
        type: AddressType.account,
        address: output.to.toString(),
      },
      assetsSent: [
        {
          assetId: output.assetId.toString(),
          amount: output.amount,
        },
      ],
    });

    return operations;
  }, [] as Operation[]);

  return payProducerOperations;
}

export function getContractCallOperations(
  tx?: Transaction,
  receipts?: TransactionResultReceipt[]
): Operation[] {
  const contractCallReceipts = getReceiptsCallResult(receipts);
  const fromAddress = getFromAddress(tx);
  const contractOutputs = getOutputsContract(tx);

  const contractCallOperations = contractOutputs.reduce(
    (prevOutputCallOps, output) => {
      const contractInput = getInputContractFromIndex(tx, output.inputIndex);

      if (contractInput) {
        const newCallOps = contractCallReceipts.reduce(
          (prevContractCallOps, receipt) => {
            if (receipt.to === contractInput.contractID) {
              const newContractCallOps = addOperation(prevOutputCallOps, {
                name: Operations.contractCall,
                from: {
                  type: AddressType.account,
                  address: fromAddress,
                },
                to: {
                  type: AddressType.contract,
                  address: receipt.to,
                },
                assetsSent: [
                  {
                    amount: receipt.amount,
                    assetId: receipt.assetId,
                  },
                ],
              });

              return newContractCallOps;
            }

            return prevContractCallOps;
          },
          prevOutputCallOps as Operation[]
        );

        return newCallOps;
      }

      return prevOutputCallOps;
    },
    [] as Operation[]
  );

  return contractCallOperations;
}

export function getOperations(
  tx?: Transaction,
  receipts?: TransactionResultReceipt[]
): Operation[] {
  const { isTypeCreate, isTypeMint, isTypeScript } = getFlags(tx);

  if (isTypeCreate) {
    return [...getContractCreatedOperations(tx), ...getTransferOperations(tx)];
  }

  if (isTypeMint) {
    return [...getPayProducerOperations(tx)];
  }

  if (isTypeScript) {
    return [
      ...getTransferOperations(tx),
      ...getContractCallOperations(tx, receipts),
    ];
  }

  return [];
}

export function getTotalAssetsSent(
  tx?: Transaction,
  receipts?: TransactionResultReceipt[]
): Coin[] {
  const operations = getOperations(tx, receipts);
  const assetsSent = operations.reduce((prev, op) => {
    const newAssetsSent = (op.assetsSent ?? []).reduce((prevOp, asset) => {
      const assetExists = prevOp.find((a) => a.assetId === asset.assetId);

      if (assetExists) {
        assetExists.amount = bn(assetExists.amount).add(asset.amount);

        return prevOp;
      }

      return [...prevOp, asset];
    }, prev);

    return newAssetsSent;
  }, [] as Coin[]);

  return assetsSent;
}

export function getContractCreatedGasUsed(
  tx?: Transaction,
  gasPerByte?: BN,
  gasPriceFacor?: BN
) {
  if (!getFlags(tx).isTypeCreate) return bn(0);

  const transactionBytes = tx ? new TransactionCoder().encode(tx) : [];
  const witnessSize =
    tx?.witnesses?.reduce((total, w) => total + w.dataLength, 0) || 0;
  const txChargeableBytes = bn(transactionBytes.length - witnessSize);

  const gasUsed = bn(
    Math.ceil(
      (txChargeableBytes.toNumber() * bn(gasPerByte).toNumber()) /
        bn(gasPriceFacor).toNumber()
    )
  );

  return gasUsed;
}

export function getContractCreatedFee(
  tx?: Transaction,
  gasPerByte?: BN,
  gasPriceFacor?: BN
) {
  const gasUsed = getContractCreatedGasUsed(tx, gasPerByte, gasPriceFacor);
  const txFee = gasUsed.mul(bn(tx?.gasPrice));

  return txFee;
}

export function getFeeFromReceipts(
  tx?: Transaction,
  receipts?: TransactionResultReceipt[],
  gasPriceFacor?: BN
) {
  if (tx?.gasPrice?.toNumber() && gasPriceFacor?.toNumber()) {
    const gasUsed = getGasUsedFromReceipts(receipts ?? []);
    const fee = calculatePriceWithFactor(
      gasUsed,
      bn(tx?.gasPrice),
      bn(gasPriceFacor)
    );

    return fee;
  }

  return bn(0);
}

export function getFee(
  tx?: Transaction,
  receipts?: TransactionResultReceipt[],
  gasPerByte?: BN,
  gasPriceFacor?: BN
) {
  const { isTypeCreate, isTypeScript } = getFlags(tx);

  if (isTypeCreate) return getContractCreatedFee(tx, gasPerByte, gasPriceFacor);
  if (isTypeScript) return getFeeFromReceipts(tx, receipts, gasPriceFacor);

  return bn(0);
}

export function getGasUsed(
  tx?: Transaction,
  receipts?: TransactionResultReceipt[],
  gasPerByte?: BN,
  gasPriceFacor?: BN
) {
  const { isTypeCreate, isTypeScript } = getFlags(tx);

  if (isTypeCreate) {
    return getContractCreatedGasUsed(tx, gasPerByte, gasPriceFacor);
  }
  if (isTypeScript) return getGasUsedFromReceipts(receipts ?? []);

  return bn(0);
}

export type ProcessTxParams = {
  transaction?: Transaction;
  receipts?: TransactionResultReceipt[];
  gqlStatus?: GqlTransactionStatus;
  gasPerByte?: BN;
  gasPriceFacor?: BN;
  // ANCHOR: START
  // TODO: for now we're receiving the id from the outside, but we should
  // get it from gqlTransaction, which will be returned after refactor in SDK side
  id?: string;
  // ANCHOR: END
};

export function processTx({
  transaction,
  receipts,
  gasPerByte,
  gasPriceFacor,
  gqlStatus,
  id,
}: ProcessTxParams) {
  const type = getType(transaction?.type);
  const status = getStatus(gqlStatus);
  const flags = getFlags(transaction, status);
  const coinInputs = getInputsCoin(transaction);
  const coinOutputs = getOutputsCoin(transaction);
  const contractOutputs = getOutputsContract(transaction);
  const changeOutput = getOutputsChange(transaction);
  const contractInput = getInputContractFromIndex(
    transaction,
    contractOutputs?.[0]?.inputIndex
  );
  const gasUsed = getGasUsed(transaction, receipts, gasPerByte, gasPriceFacor);
  const fee = getFee(transaction, receipts, gasPerByte, gasPriceFacor);
  const operations = getOperations(transaction, receipts);
  const totalAssetsSent = getTotalAssetsSent(transaction, receipts);

  return {
    id,
    coinInputs,
    coinOutputs,
    contractOutputs,
    changeOutput,
    contractInput,
    operations,
    gasUsed,
    fee,
    type,
    status,
    totalAssetsSent,
    ...flags,
  };
}

export * from './error';
export * from './tx';
