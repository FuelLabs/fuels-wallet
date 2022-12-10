import type { BN, Transaction, TransactionRequestInput } from 'fuels';
import {
  bn,
  calculatePriceWithFactor,
  TransactionCoder,
  InputType,
  OutputType,
} from 'fuels';

import type {
  TxInputCoin,
  TxInputContract,
  TxOutputCoin,
  TxOutputContract,
  TxRequest,
  TxResponse,
} from '../types';

export function parseTransaction<T extends TxRequest | TxResponse>(tx: T) {
  return Object.entries(tx).reduce((obj, [key, value]) => {
    const val =
      value instanceof Uint8Array ? value : JSON.parse(JSON.stringify(value));
    return { ...obj, [key]: val };
  }, {} as T);
}

export function getCoinInputsFromTx(tx?: TxRequest | Transaction) {
  return ((tx?.inputs as TransactionRequestInput[]) ?? []).filter(
    (i) => i.type === InputType.Coin
  ) as TxInputCoin[];
}

export function getContractInputFromIndex({
  tx,
  inputIndex,
}: {
  tx?: TxRequest | Transaction;
  inputIndex: number;
}): TxInputContract | undefined {
  const contractInput = tx?.inputs?.[inputIndex];

  if (!contractInput) return undefined;
  if (contractInput.type !== InputType.Contract) {
    throw new Error('Contract input should be of type Contract');
  }

  return contractInput as TxInputContract;
}

export function getOutputsFromTx<T>({
  tx,
  type,
}: {
  tx?: TxRequest | Transaction;
  type: OutputType;
}) {
  return (tx?.outputs ?? []).filter((i) => i.type === type) as T[];
}

export function getCoinOutputsFromTx(tx?: TxRequest | Transaction) {
  return getOutputsFromTx<TxOutputCoin>({
    tx,
    type: OutputType.Coin,
  });
}

export function getContractOutputsFromTx(tx?: TxRequest | Transaction) {
  return getOutputsFromTx<TxOutputContract>({
    tx,
    type: OutputType.Contract,
  });
}

export function getChangeOutputFromTx(tx?: TxRequest | Transaction) {
  return getOutputsFromTx<TxOutputCoin>({
    tx,
    type: OutputType.Change,
  })?.[0];
}

export function getGasUsedContractCreated(
  tx?: Transaction,
  options: { gasPerByte: BN; gasPriceFacor: BN } = {
    gasPerByte: bn(0),
    gasPriceFacor: bn(0),
  }
) {
  const { gasPerByte, gasPriceFacor } = options;
  const transactionBytes = tx ? new TransactionCoder().encode(tx) : [];
  const witnessSize =
    tx?.witnesses?.reduce((total, w) => total + w.dataLength, 0) || 0;
  const txChargeableBytes = bn(transactionBytes.length - witnessSize);

  const contractGasUsed = calculatePriceWithFactor(
    txChargeableBytes,
    gasPerByte,
    gasPriceFacor
  );

  return contractGasUsed;
}

export * from './error';
export * from './tx';
