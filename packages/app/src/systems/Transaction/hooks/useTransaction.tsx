import { AddressType } from '@fuel-wallet/types';
import { useInterpret, useSelector } from '@xstate/react';
import { bn, TransactionType } from 'fuels';
import { useEffect, useMemo } from 'react';

import type { TransactionMachineState } from '../machines';
import { TRANSACTION_ERRORS, transactionMachine } from '../machines';
import type { TxInputs } from '../services';
import { TxStatus } from '../types';
import {
  getCoinInputsFromTx,
  getCoinOutputsFromTx,
  getContractInputFromIndex,
  getContractOutputsFromTx,
} from '../utils';

const selectors = {
  isFetching: (state: TransactionMachineState) => state.matches('fetching'),
  isFetchingResult: (state: TransactionMachineState) =>
    state.matches('fetchingResult'),
  context: (state: TransactionMachineState) => state.context,
};

type UseTransactionProps = {
  txId?: string;
  providerUrl?: string;
  waitProviderUrl?: boolean;
};

export function useTransaction({
  txId: txIdInput,
  providerUrl,
  waitProviderUrl,
}: UseTransactionProps) {
  const service = useInterpret(() => transactionMachine);
  const { send } = service;
  const isFetching = useSelector(service, selectors.isFetching);
  const isFetchingResult = useSelector(service, selectors.isFetchingResult);
  const context = useSelector(service, selectors.context);

  const { txResponse, error, txStatus, tx, txResult, fee, txId } = context;

  const { coinInputs, coinOutputs, contractOutputs } = useMemo(() => {
    if (!tx) return { coinInputs: [], coinOutputs: [], contractOutputs: [] };

    const coinInputs = getCoinInputsFromTx(tx);
    const coinOutputs = getCoinOutputsFromTx(tx);
    const contractOutputs = getContractOutputsFromTx(tx);

    return { coinInputs, coinOutputs, contractOutputs };
  }, [tx]);

  const { outputsToSend, outputAmount, txFrom, txTo, contractInput } =
    useMemo(() => {
      const inputPublicKey = coinInputs[0]?.owner;
      const outputsToSend = coinOutputs.filter(
        (value) => value.to !== inputPublicKey
      );
      const outputAmount = outputsToSend.reduce(
        (acc, value) => acc.add(value.amount),
        bn(0)
      );
      const contractInput = getContractInputFromIndex({
        tx,
        inputIndex: contractOutputs?.[0]?.inputIndex,
      });
      const txFrom = inputPublicKey?.toString()
        ? {
            type: AddressType.account,
            address: inputPublicKey?.toString(),
          }
        : undefined;
      let txTo;
      if (contractInput) {
        txTo = {
          type: AddressType.contract,
          address: contractInput.contractID,
        };
      } else if (outputsToSend[0]?.to.toString()) {
        txTo = {
          type: AddressType.account,
          address: outputsToSend[0]?.to.toString(),
        };
      }

      return {
        outputsToSend,
        outputAmount,
        contractInput,
        txFrom,
        txTo,
      };
    }, [coinInputs, coinOutputs, contractOutputs]);

  const isTxPending = txStatus === TxStatus.pending;
  const isTxFailed = txStatus === TxStatus.error;
  const isInvalidTxId = error === TRANSACTION_ERRORS.INVALID_ID;
  const isTxNotFound = error === TRANSACTION_ERRORS.NOT_FOUND;
  const isTxReceiptsNotFound = error === TRANSACTION_ERRORS.RECEIPTS_NOT_FOUND;
  const shouldShowAlert =
    isTxNotFound || isInvalidTxId || isTxPending || isTxFailed;
  const shouldShowTx = tx && !isFetching && !isInvalidTxId && !isTxNotFound;
  const shouldShowTxDetails =
    shouldShowTx && !isFetchingResult && tx.type !== TransactionType.Mint;
  const isFetchingDetails = isFetching || isFetchingResult;
  const shouldShowAssetsAmount = Boolean(outputsToSend?.length);

  function getTransaction(input: TxInputs['fetch']) {
    send('GET_TRANSACTION', { input });
  }

  useEffect(() => {
    if (txIdInput && (providerUrl || !waitProviderUrl)) {
      getTransaction({ txId: txIdInput, providerUrl });
    }
  }, [txIdInput, providerUrl, waitProviderUrl]);

  return {
    handlers: {
      getTransaction,
    },
    isFetching,
    isFetchingDetails,
    isFetchingResult,
    txResponse,
    isInvalidTxId,
    isTxNotFound,
    isTxReceiptsNotFound,
    txStatus,
    tx,
    txResult,
    contractInput,
    coinInputs,
    coinOutputs,
    outputsToSend,
    outputAmount,
    fee,
    txId,
    error,
    shouldShowAlert,
    shouldShowTx,
    shouldShowTxDetails,
    txFrom,
    txTo,
    shouldShowAssetsAmount,
  };
}
