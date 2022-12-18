import { AddressType } from '@fuel-wallet/types';
import type {
  Input,
  InputCoin,
  InputContract,
  InputMessage,
  Output,
  OutputCoin,
  OutputContract,
  OutputContractCreated,
  OutputMessage,
  OutputVariable,
  TransactionResultCallReceipt,
  TransactionResultLogDataReceipt,
  TransactionResultLogReceipt,
  TransactionResultMessageOutReceipt,
  TransactionResultPanicReceipt,
  TransactionResultReceipt,
  TransactionResultReturnDataReceipt,
  TransactionResultReturnReceipt,
  TransactionResultRevertReceipt,
  TransactionResultScriptResultReceipt,
  TransactionResultTransferOutReceipt,
  TransactionResultTransferReceipt,
} from 'fuels';
import {
  calculatePriceWithFactor,
  ReceiptType,
  TransactionType,
  bn,
  TransactionCoder,
  InputType,
  OutputType,
} from 'fuels';

import type {
  Coin,
  GetFeeFromReceiptsParams,
  GetFeeParams,
  GetGasUsedContractCreatedParams,
  GetGasUsedParams,
  GetOperationParams,
  GqlTransactionStatus,
  InputOutputParam,
  Operation,
  ParseTxParams,
  ReceiptParam,
  Tx,
} from './tx.types';
import { Operations, Type, Status } from './tx.types';

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

export function getInputsByType<T = Input>(inputs: Input[], type: InputType) {
  return (inputs ?? []).filter((i) => i.type === type) as T[];
}

export function getInputsCoin(inputs: Input[]) {
  return getInputsByType<InputCoin>(inputs, InputType.Coin);
}

export function getInputsContract(inputs: Input[]) {
  return getInputsByType<InputContract>(inputs, InputType.Contract);
}

export function getInputsMessage(inputs: Input[]) {
  return getInputsByType<InputMessage>(inputs, InputType.Message);
}

export function getInputContractFromIndex(
  inputs: Input[],
  inputIndex: number
): InputContract | undefined {
  if (inputIndex == null) return undefined;

  const contractInput = inputs?.[inputIndex];

  if (!contractInput) return undefined;
  if (contractInput.type !== InputType.Contract) {
    throw new Error('Contract input should be of type Contract');
  }

  return contractInput as InputContract;
}

export function getFromAddress(inputs: Input[]) {
  // considering only one address will send coin inputs, we can safely get first one
  return getInputsCoin(inputs)[0]?.owner.toString();
}

export function getOutputsByType<T = Output>(
  outputs: Output[],
  type: OutputType
) {
  return (outputs ?? []).filter((o) => o.type === type) as T[];
}

export function getOutputsCoin(outputs: Output[]) {
  return getOutputsByType<OutputCoin>(outputs, OutputType.Coin);
}

export function getOutputsContract(outputs: Output[]) {
  return getOutputsByType<OutputContract>(outputs, OutputType.Contract);
}

export function getOutputsMessage(outputs: Output[]) {
  return getOutputsByType<OutputMessage>(outputs, OutputType.Message);
}

export function getOutputsChange(outputs: Output[]) {
  return getOutputsByType<OutputCoin>(outputs, OutputType.Change);
}

export function getOutputsVariable(outputs: Output[]) {
  return getOutputsByType<OutputVariable>(outputs, OutputType.Variable);
}

export function getOutputsContractCreated(outputs: Output[]) {
  return getOutputsByType<OutputContractCreated>(
    outputs,
    OutputType.ContractCreated
  );
}

export function getReceiptsByType<T = TransactionResultReceipt>(
  receipts: TransactionResultReceipt[],
  type: ReceiptType
) {
  return (receipts ?? []).filter((r) => r.type === type) as T[];
}

export function getReceiptsCall(receipts: TransactionResultReceipt[]) {
  return getReceiptsByType<TransactionResultCallReceipt>(
    receipts,
    ReceiptType.Call
  );
}

export function getReceiptsReturn(receipts: TransactionResultReceipt[]) {
  return getReceiptsByType<TransactionResultReturnReceipt>(
    receipts,
    ReceiptType.Return
  );
}

export function getReceiptsReturnData(receipts: TransactionResultReceipt[]) {
  return getReceiptsByType<TransactionResultReturnDataReceipt>(
    receipts,
    ReceiptType.ReturnData
  );
}

export function getReceiptsPanic(receipts: TransactionResultReceipt[]) {
  return getReceiptsByType<TransactionResultPanicReceipt>(
    receipts,
    ReceiptType.Panic
  );
}

export function getReceiptsRevert(receipts: TransactionResultReceipt[]) {
  return getReceiptsByType<TransactionResultRevertReceipt>(
    receipts,
    ReceiptType.Revert
  );
}

export function getReceiptsLog(receipts: TransactionResultReceipt[]) {
  return getReceiptsByType<TransactionResultLogReceipt>(
    receipts,
    ReceiptType.Log
  );
}

export function getReceiptsLogData(receipts: TransactionResultReceipt[]) {
  return getReceiptsByType<TransactionResultLogDataReceipt>(
    receipts,
    ReceiptType.LogData
  );
}

export function getReceiptsTransfer(receipts: TransactionResultReceipt[]) {
  return getReceiptsByType<TransactionResultTransferReceipt>(
    receipts,
    ReceiptType.Transfer
  );
}

export function getReceiptsTransferOut(receipts: TransactionResultReceipt[]) {
  return getReceiptsByType<TransactionResultTransferOutReceipt>(
    receipts,
    ReceiptType.TransferOut
  );
}

export function getReceiptsScriptResult(receipts: TransactionResultReceipt[]) {
  return getReceiptsByType<TransactionResultScriptResultReceipt>(
    receipts,
    ReceiptType.ScriptResult
  );
}

export function getReceiptsMessageOut(receipts: TransactionResultReceipt[]) {
  return getReceiptsByType<TransactionResultMessageOutReceipt>(
    receipts,
    ReceiptType.MessageOut
  );
}

export function getType(transactionType: TransactionType): Type {
  switch (transactionType) {
    case TransactionType.Mint:
      return Type.mint;
    case TransactionType.Create:
      return Type.create;
    case TransactionType.Script:
      return Type.script;
    default:
      throw new Error('Unknown transaction type');
  }
}

export function isType(transactionType: TransactionType, type: Type) {
  const txType = getType(transactionType);

  return txType === type;
}

export function isTypeMint(transactionType: TransactionType) {
  return isType(transactionType, Type.mint);
}

export function isTypeCreate(transactionType: TransactionType) {
  return isType(transactionType, Type.create);
}

export function isTypeScript(transactionType: TransactionType) {
  return isType(transactionType, Type.script);
}

export function isStatus(
  transactionStatus?: GqlTransactionStatus,
  status?: Status
) {
  const txStatus = getStatus(transactionStatus);

  return transactionStatus && status === txStatus;
}

export function isStatusPending(transactionStatus?: GqlTransactionStatus) {
  return isStatus(transactionStatus, Status.pending);
}

export function isStatusSuccess(transactionStatus?: GqlTransactionStatus) {
  return isStatus(transactionStatus, Status.success);
}

export function isStatusFailure(transactionStatus?: GqlTransactionStatus) {
  return isStatus(transactionStatus, Status.failure);
}

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
export function getContractCreatedOperations({
  inputs,
  outputs,
}: InputOutputParam): Operation[] {
  const contractCreatedOutputs = getOutputsContractCreated(outputs);
  const contractCreatedOperations = contractCreatedOutputs.reduce(
    (prev, contractCreatedOutput) => {
      const operations = addOperation(prev, {
        name: Operations.contractCreated,
        from: {
          type: AddressType.account,
          address: getFromAddress(inputs),
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

export function getTransferOperations({
  inputs,
  outputs,
}: InputOutputParam): Operation[] {
  const coinInputs = getInputsCoin(inputs);
  const coinOutputs = getOutputsCoin(outputs);

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

export function getPayProducerOperations(outputs: Output[]): Operation[] {
  const coinOutputs = getOutputsCoin(outputs);
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

export function getContractCallOperations({
  inputs,
  outputs,
  receipts,
}: InputOutputParam & ReceiptParam): Operation[] {
  const contractCallReceipts = getReceiptsCall(receipts);
  const fromAddress = getFromAddress(inputs);
  const contractOutputs = getOutputsContract(outputs);

  const contractCallOperations = contractOutputs.reduce(
    (prevOutputCallOps, output) => {
      const contractInput = getInputContractFromIndex(
        inputs,
        output.inputIndex
      );

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

export function getOperations({
  transactionType,
  inputs,
  outputs,
  receipts,
}: GetOperationParams): Operation[] {
  if (isTypeCreate(transactionType)) {
    return [
      ...getContractCreatedOperations({ inputs, outputs }),
      ...getTransferOperations({ inputs, outputs }),
    ];
  }

  if (isTypeMint(transactionType)) {
    return [...getPayProducerOperations(outputs)];
  }

  if (isTypeScript(transactionType)) {
    return [
      ...getTransferOperations({ inputs, outputs }),
      ...getContractCallOperations({ inputs, outputs, receipts }),
    ];
  }

  return [];
}

export function getTotalAssetsSent({
  transactionType,
  inputs,
  outputs,
  receipts,
}: GetOperationParams): Coin[] {
  const operations = getOperations({
    transactionType,
    inputs,
    outputs,
    receipts,
  });
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

export function getGasUsedContractCreated({
  transaction,
  gasPerByte,
  gasPriceFactor,
}: GetGasUsedContractCreatedParams) {
  if (!isTypeCreate(transaction.type)) return bn(0);

  const transactionBytes = transaction
    ? new TransactionCoder().encode(transaction)
    : [];
  const witnessSize =
    transaction?.witnesses?.reduce((total, w) => total + w.dataLength, 0) || 0;
  const txChargeableBytes = bn(transactionBytes.length - witnessSize);

  const gasUsed = bn(
    Math.ceil(
      (txChargeableBytes.toNumber() * bn(gasPerByte).toNumber()) /
        bn(gasPriceFactor).toNumber()
    )
  );

  return gasUsed;
}

export function getGasUsedFromReceipts(receipts: TransactionResultReceipt[]) {
  const scriptReceipts = getReceiptsScriptResult(receipts);
  const gasUsed = scriptReceipts.reduce(
    (prev, receipt) => prev.add(receipt.gasUsed),
    bn(0)
  );

  return gasUsed;
}

export function getGasUsed({
  transaction,
  receipts,
  gasPerByte,
  gasPriceFactor,
}: GetGasUsedParams) {
  if (isTypeCreate(transaction.type)) {
    return getGasUsedContractCreated({
      transaction,
      gasPerByte,
      gasPriceFactor,
    });
  }
  if (isTypeScript(transaction.type))
    return getGasUsedFromReceipts(receipts ?? []);

  return bn(0);
}

export function getContractCreatedFee({
  transaction,
  gasPerByte,
  gasPriceFactor,
}: GetGasUsedContractCreatedParams) {
  const gasUsed = getGasUsedContractCreated({
    transaction,
    gasPerByte,
    gasPriceFactor,
  });
  const txFee = gasUsed.mul(bn(transaction.gasPrice));

  return txFee;
}

export function getFeeFromReceipts({
  gasPrice,
  receipts,
  gasPriceFactor,
}: GetFeeFromReceiptsParams) {
  if (gasPrice.gt(0)) {
    const gasUsed = getGasUsedFromReceipts(receipts ?? []);
    const fee = calculatePriceWithFactor(gasUsed, gasPrice, gasPriceFactor);

    return fee;
  }

  return bn(0);
}

export function getFee({
  transaction,
  receipts,
  gasPerByte,
  gasPriceFactor,
}: GetFeeParams) {
  if (isTypeCreate(transaction.type)) {
    return getContractCreatedFee({ transaction, gasPerByte, gasPriceFactor });
  }

  if (isTypeScript(transaction.type)) {
    return getFeeFromReceipts({
      gasPrice: bn(transaction.gasPrice),
      receipts,
      gasPriceFactor,
    });
  }

  return bn(0);
}

export function parseTx({
  transaction,
  receipts,
  gasPerByte,
  gasPriceFactor,
  gqlStatus,
  id,
}: ParseTxParams): Tx {
  const type = getType(transaction.type);
  const status = getStatus(gqlStatus);
  const gasUsed = getGasUsed({
    transaction,
    receipts,
    gasPerByte,
    gasPriceFactor,
  });
  const fee = getFee({ transaction, receipts, gasPerByte, gasPriceFactor });
  const operations = getOperations({
    transactionType: transaction.type,
    inputs: transaction.inputs || [],
    outputs: transaction.outputs || [],
    receipts,
  });
  const totalAssetsSent = getTotalAssetsSent({
    transactionType: transaction.type,
    inputs: transaction.inputs || [],
    outputs: transaction.outputs || [],
    receipts,
  });

  return {
    id,
    operations,
    gasUsed,
    fee,
    type,
    status,
    totalAssetsSent,
    isTypeCreate: isTypeCreate(transaction.type),
    isTypeScript: isTypeScript(transaction.type),
    isTypeMint: isTypeMint(transaction.type),
    isStatusFailure: isStatusFailure(gqlStatus),
    isStatusSuccess: isStatusSuccess(gqlStatus),
    isStatusPending: isStatusPending(gqlStatus),
  };
}
