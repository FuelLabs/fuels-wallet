/* eslint-disable no-restricted-syntax */
// TODO: this whole tx utils need be moved to SDK
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

import { getFunctionCall } from './call';
import type {
  AbiParam,
  Coin,
  GetFeeFromReceiptsParams,
  GetFeeParams,
  GetGasUsedContractCreatedParams,
  GetGasUsedFromReceiptsParams,
  GetGasUsedParams,
  GetOperationParams,
  GqlTransactionStatus,
  InputOutputParam,
  InputParam,
  Operation,
  ParseTxParams,
  RawPayloadParam,
  ReceiptParam,
  Tx,
} from './types';
import { ChainName, OperationName, TxType, TxStatus } from './types';

export const getStatus = (
  gqlStatus?: GqlTransactionStatus
): TxStatus | undefined => {
  switch (gqlStatus) {
    case 'FailureStatus':
      return TxStatus.failure;
    case 'SuccessStatus':
      return TxStatus.success;
    case 'SubmittedStatus':
      return TxStatus.pending;
    case 'SqueezedOutStatus':
      return TxStatus.squeezedOut;
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

export function getInputFromAssetId(inputs: Input[], assetId: string) {
  const coinInputs = getInputsCoin(inputs);
  const messageInputs = getInputsMessage(inputs);
  const coinInput = coinInputs.find((i) => i.assetId === assetId);
  // TODO: should include assetId in InputMessage as well. for now we're mocking ETH
  const messageInput = messageInputs.find(
    (_) =>
      assetId ===
      '0x0000000000000000000000000000000000000000000000000000000000000000'
  );

  return coinInput || messageInput;
}

export function getInputAccountAddress(input: Input) {
  if (input.type === InputType.Coin) {
    return input.owner.toString();
  }

  if (input.type === InputType.Message) {
    return input.recipient.toString();
  }

  return '';
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

export function getType(transactionType: TransactionType): TxType {
  switch (transactionType) {
    case TransactionType.Mint:
      return TxType.mint;
    case TransactionType.Create:
      return TxType.create;
    case TransactionType.Script:
      return TxType.script;
    default:
      throw new Error('Unknown transaction type');
  }
}

export function isType(transactionType: TransactionType, type: TxType) {
  const txType = getType(transactionType);

  return txType === type;
}

export function isTypeMint(transactionType: TransactionType) {
  return isType(transactionType, TxType.mint);
}

export function isTypeCreate(transactionType: TransactionType) {
  return isType(transactionType, TxType.create);
}

export function isTypeScript(transactionType: TransactionType) {
  return isType(transactionType, TxType.script);
}

export function isStatus(
  transactionStatus?: GqlTransactionStatus,
  status?: TxStatus
) {
  const txStatus = getStatus(transactionStatus);

  return transactionStatus && status === txStatus;
}

export function isStatusPending(transactionStatus?: GqlTransactionStatus) {
  return isStatus(transactionStatus, TxStatus.pending);
}

export function isStatusSuccess(transactionStatus?: GqlTransactionStatus) {
  return isStatus(transactionStatus, TxStatus.success);
}

export function isStatusFailure(transactionStatus?: GqlTransactionStatus) {
  return isStatus(transactionStatus, TxStatus.failure);
}

function isSameOperation(a: Operation, b: Operation) {
  return (
    a.name === b.name &&
    a.from?.address === b.from?.address &&
    a.to?.address === b.to?.address &&
    a.from?.type === b.from?.type &&
    a.to?.type === b.to?.type
  );
}

function hasSameAssetId(a: Coin) {
  return (b: Coin) => a.assetId === b.assetId;
}

const mergeAssets = (op1: Operation, op2: Operation) => {
  const assets1 = op1.assetsSent || [];
  const assets2 = op2.assetsSent || [];
  const filtered = assets2.filter((c) => !assets1.some(hasSameAssetId(c)));
  return assets1
    .map((coin) => {
      const asset = assets2.find(hasSameAssetId(coin));
      if (!asset) return coin;
      return { ...coin, amount: bn(coin.amount).add(asset.amount) };
    })
    .concat(filtered);
};

export function addOperation(operations: Operation[], toAdd: Operation) {
  const ops = operations
    .map((op) => {
      // if it's not same operation, don't change. we just wanna stack the same operation
      if (!isSameOperation(op, toAdd)) return null;

      let newOp = { ...op };

      // if it's adding new assets
      if (toAdd.assetsSent?.length) {
        // if prev op had assets, merge them. Otherwise just add the new assets
        newOp = {
          ...newOp,
          assetsSent: op.assetsSent?.length
            ? mergeAssets(op, toAdd)
            : toAdd.assetsSent,
        };
      }

      // if it's adding new calls,
      if (toAdd.calls?.length) {
        /*  
          for calls we don't stack as grouping is not desired.
          we wanna show all calls in the same operation
          with each respective assets, amounts, functions, arguments.
        */
        newOp = {
          ...newOp,
          calls: [...(op.calls || []), ...(toAdd.calls || [])],
        };
      }

      return newOp;
    })
    .filter(Boolean) as Operation[];

  // if this operation didn't exist before just add it to the end
  return ops.length ? ops : [...operations, toAdd];
}

export function getContractCreatedOperations({
  inputs,
  outputs,
}: InputOutputParam): Operation[] {
  const contractCreatedOutputs = getOutputsContractCreated(outputs);
  const input = getInputsCoin(inputs)[0];
  const fromAddress = getInputAccountAddress(input);
  const contractCreatedOperations = contractCreatedOutputs.reduce(
    (prev, contractCreatedOutput) => {
      const operations = addOperation(prev, {
        name: OperationName.contractCreated,
        from: {
          type: AddressType.account,
          address: fromAddress,
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
  const coinOutputs = getOutputsCoin(outputs);

  let operations: Operation[] = [];
  for (const output of coinOutputs) {
    const input = getInputFromAssetId(inputs, output.assetId);

    if (input) {
      const inputAddress = getInputAccountAddress(input);
      operations = addOperation(operations, {
        name: OperationName.transfer,
        from: {
          type: AddressType.account,
          address: inputAddress,
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
  }

  return operations;
}

export function getPayProducerOperations(outputs: Output[]): Operation[] {
  const coinOutputs = getOutputsCoin(outputs);
  const payProducerOperations = coinOutputs.reduce((prev, output) => {
    const operations = addOperation(prev, {
      name: OperationName.payBlockProducer,
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
  abiMap,
  rawPayload,
}: InputOutputParam & ReceiptParam & AbiParam & RawPayloadParam): Operation[] {
  const contractCallReceipts = getReceiptsCall(receipts);
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
              const input = getInputFromAssetId(inputs, receipt.assetId);
              if (input) {
                const inputAddress = getInputAccountAddress(input);
                const calls = [];

                const abi = abiMap?.[contractInput.contractID];
                if (abi) {
                  calls.push(
                    getFunctionCall({
                      abi,
                      receipt,
                      rawPayload,
                    })
                  );
                }

                const newContractCallOps = addOperation(prevContractCallOps, {
                  name: OperationName.contractCall,
                  from: {
                    type: AddressType.account,
                    address: inputAddress,
                  },
                  to: {
                    type: AddressType.contract,
                    address: receipt.to,
                  },
                  // if no amount is forwarded to the contract, skip showing assetsSent
                  assetsSent: receipt.amount?.isZero()
                    ? undefined
                    : [
                        {
                          amount: receipt.amount,
                          assetId: receipt.assetId,
                        },
                      ],
                  calls,
                });

                return newContractCallOps;
              }
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

export function getContractTransferOperations({
  receipts,
}: ReceiptParam): Operation[] {
  const transferOutReceipts = getReceiptsTransferOut(receipts);

  const contractTransferOperations = transferOutReceipts.reduce(
    (prevContractTransferOps, receipt) => {
      const newContractTransferOps = addOperation(prevContractTransferOps, {
        name: OperationName.contractTransfer,
        from: {
          type: AddressType.contract,
          address: receipt.from,
        },
        to: {
          type: AddressType.account,
          address: receipt.to,
        },
        assetsSent: [
          {
            amount: receipt.amount,
            assetId: receipt.assetId,
          },
        ],
      });

      return newContractTransferOps;
    },
    [] as Operation[]
  );

  return contractTransferOperations;
}

export function getWithdrawFromFuelOperations({
  inputs,
  receipts,
}: InputParam & ReceiptParam): Operation[] {
  const messageOutReceipts = getReceiptsMessageOut(receipts);

  const withdrawFromFuelOperations = messageOutReceipts.reduce(
    (prevWithdrawFromFuelOps, receipt) => {
      // TODO: replace this hardcode with receipt.assetId when assetId gets added to MessageOutReceipt
      const assetId =
        '0x0000000000000000000000000000000000000000000000000000000000000000';
      const input = getInputFromAssetId(inputs, assetId);
      if (input) {
        const inputAddress = getInputAccountAddress(input);
        const newWithdrawFromFuelOps = addOperation(prevWithdrawFromFuelOps, {
          name: OperationName.withdrawFromFuel,
          from: {
            type: AddressType.account,
            address: inputAddress,
          },
          to: {
            type: AddressType.account,
            address: receipt.recipient.toString(),
            chain: ChainName.ethereum,
          },
          assetsSent: [
            {
              amount: receipt.amount,
              assetId,
            },
          ],
        });

        return newWithdrawFromFuelOps;
      }

      return prevWithdrawFromFuelOps;
    },
    [] as Operation[]
  );

  return withdrawFromFuelOperations;
}

export function getOperations({
  transactionType,
  inputs,
  outputs,
  receipts,
  abiMap,
  rawPayload,
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
      ...getContractCallOperations({
        inputs,
        outputs,
        receipts,
        abiMap,
        rawPayload,
      }),
      ...getContractTransferOperations({ receipts }),
      ...getWithdrawFromFuelOperations({ inputs, receipts }),
    ];
  }

  return [];
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

export function getGasUsedFromReceipts({
  receipts,
}: GetGasUsedFromReceiptsParams) {
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
    return getGasUsedFromReceipts({ receipts: receipts ?? [] });

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
    const gasUsed = getGasUsedFromReceipts({ receipts: receipts ?? [] });
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
  time,
  abiMap: abi,
  rawPayload,
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
    abiMap: abi,
    rawPayload,
  });

  return {
    id,
    operations,
    gasUsed,
    fee,
    isTypeCreate: isTypeCreate(transaction.type),
    isTypeScript: isTypeScript(transaction.type),
    isTypeMint: isTypeMint(transaction.type),
    isStatusFailure: isStatusFailure(gqlStatus),
    isStatusSuccess: isStatusSuccess(gqlStatus),
    isStatusPending: isStatusPending(gqlStatus),
    type,
    status,
    time,
  };
}
