import { useInterpret, useSelector } from '@xstate/react';
import { useEffect, useMemo } from 'react';

import type { TransactionMachineState } from '../machines';
import { TRANSACTION_ERRORS, transactionMachine } from '../machines';
import type { TxInputs } from '../services';

const selectors = {
  isFetching: (state: TransactionMachineState) => state.matches('fetching'),
  isFetchingResult: (state: TransactionMachineState) =>
    state.matches('fetchingResult'),
  isLoading: (state: TransactionMachineState) => state.hasTag('isLoading'),
  context: (state: TransactionMachineState) => state.context,
  isInvalidTxId: (state: TransactionMachineState) =>
    state.context.error === TRANSACTION_ERRORS.INVALID_ID,
  isTxNotFound: (state: TransactionMachineState) =>
    state.context.error === TRANSACTION_ERRORS.NOT_FOUND,
  isTxReceiptsNotFound: (state: TransactionMachineState) =>
    state.context.error === TRANSACTION_ERRORS.RECEIPTS_NOT_FOUND,
};

type UseTxResultProps = {
  txId?: string;
  providerUrl?: string;
  waitProviderUrl?: boolean;
};

export function useTxResult({
  txId: txIdInput,
  providerUrl,
  waitProviderUrl,
}: UseTxResultProps) {
  const service = useInterpret(() => transactionMachine);
  const { send } = service;
  const isFetching = useSelector(service, selectors.isFetching);
  const isFetchingResult = useSelector(service, selectors.isFetchingResult);
  const isLoading = useSelector(service, selectors.isLoading);
  const context = useSelector(service, selectors.context);
  const isInvalidTxId = useSelector(service, selectors.isInvalidTxId);
  const isTxNotFound = useSelector(service, selectors.isTxNotFound);
  const isTxReceiptsNotFound = useSelector(
    service,
    selectors.isTxReceiptsNotFound
  );

  const { error, txResult } = context;

  const { shouldShowAlert, shouldShowTx, shouldShowTxDetails } = useMemo(() => {
    const shouldShowAlert =
      isTxNotFound ||
      isInvalidTxId ||
      txResult?.isStatusPending ||
      txResult?.isStatusFailure;
    const shouldShowTx =
      txResult && !isFetching && !isInvalidTxId && !isTxNotFound;
    const shouldShowTxDetails = shouldShowTx && !txResult?.isTypeMint;

    return {
      shouldShowAlert,
      shouldShowTx,
      shouldShowTxDetails,
    };
  }, [
    isTxNotFound,
    isInvalidTxId,
    isLoading,
    txResult?.isStatusPending,
    txResult?.isStatusFailure,
    txResult?.isTypeMint,
  ]);

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
    isLoading,
    isFetching,
    isFetchingResult,
    isInvalidTxId,
    isTxNotFound,
    isTxReceiptsNotFound,
    shouldShowAlert,
    shouldShowTx,
    shouldShowTxDetails,
    txResult,
    error,
  };
}
