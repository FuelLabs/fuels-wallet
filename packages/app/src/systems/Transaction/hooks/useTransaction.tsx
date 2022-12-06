import { AddressType } from '@fuel-wallet/types';
import { useInterpret, useSelector } from '@xstate/react';
import { bn } from 'fuels';
import { useEffect, useMemo } from 'react';

import type { TransactionMachineState } from '../machines';
import { TRANSACTION_ERRORS, transactionMachine } from '../machines';
import type { TxInputs } from '../services';
import { TxStatus } from '../types';
import { getCoinInputsFromTx, getCoinOutputsFromTx } from '../utils';

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
  const { coinInputs, coinOutputs, outputsToSend, outputAmount, txFrom, txTo } =
    useMemo(() => {
      if (!tx)
        return { coinOutputs: [], outputsToSend: [], outputAmount: bn(0) };

      const coinInputs = getCoinInputsFromTx(tx);
      const coinOutputs = getCoinOutputsFromTx(tx);
      const inputPublicKey = coinInputs[0]?.owner;
      const outputsToSend = coinOutputs.filter(
        (value) => value.to !== inputPublicKey
      );
      const outputAmount = outputsToSend.reduce(
        (acc, value) => acc.add(value.amount),
        bn(0)
      );

      const txFrom = coinInputs?.[0]?.owner.toString()
        ? {
            type: AddressType.account,
            address: coinInputs[0].owner.toString(),
          }
        : undefined;
      const txTo = outputsToSend[0]?.to.toString()
        ? {
            type: AddressType.account,
            address: outputsToSend[0]?.to.toString(),
          }
        : undefined;

      return {
        coinInputs,
        coinOutputs,
        outputsToSend,
        outputAmount,
        txFrom,
        txTo,
      };
    }, [tx]);

  const isTxPending = txStatus === TxStatus.pending;
  const isTxFailed = txStatus === TxStatus.error;
  const isInvalidTxId = error === TRANSACTION_ERRORS.INVALID_ID;
  const isTxNotFound = error === TRANSACTION_ERRORS.NOT_FOUND;
  const isTxReceiptsNotFound = error === TRANSACTION_ERRORS.RECEIPTS_NOT_FOUND;
  const shouldShowAlert =
    isTxNotFound || isInvalidTxId || isTxPending || isTxFailed;
  const shouldShowTx = tx && !isFetching && !isInvalidTxId && !isTxNotFound;
  const shouldShowTxDetails = tx && !isFetching && !isFetchingResult;

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
    isFetchingResult,
    txResponse,
    isInvalidTxId,
    isTxNotFound,
    isTxReceiptsNotFound,
    txStatus,
    tx,
    txResult,
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
  };
}
