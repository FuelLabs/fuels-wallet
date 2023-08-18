import { useInterpret, useSelector } from '@xstate/react';
import { useEffect, useMemo } from 'react';

import type { TransactionMachineState } from '../machines';
import { TRANSACTION_ERRORS, transactionMachine } from '../machines';
import type { TxInputs } from '../services';

import { useParseTx } from './useParseTx';

import { useChainInfo } from '~/systems/Network';

const selectors = {
  isFetching: (state: TransactionMachineState) => state.matches('fetching'),
  isFetchingResult: (state: TransactionMachineState) =>
    state.matches('fetchingResult'),
  context: (state: TransactionMachineState) => state.context,
  isInvalidTxId: (state: TransactionMachineState) =>
    state.context.error === TRANSACTION_ERRORS.INVALID_ID,
  isTxNotFound: (state: TransactionMachineState) =>
    state.context.error === TRANSACTION_ERRORS.NOT_FOUND,
  isTxReceiptsNotFound: (state: TransactionMachineState) =>
    state.context.error === TRANSACTION_ERRORS.RECEIPTS_NOT_FOUND,
};

type UseTxProps = {
  txId?: string;
  providerUrl?: string;
  waitProviderUrl?: boolean;
};

export function useTx({
  txId: txIdInput,
  providerUrl,
  waitProviderUrl,
}: UseTxProps) {
  const { chainInfo, isLoading: isLoadingChainInfo } =
    useChainInfo(providerUrl);
  const service = useInterpret(() => transactionMachine);
  const { send } = service;
  const isFetching = useSelector(service, selectors.isFetching);
  const isFetchingResult = useSelector(service, selectors.isFetchingResult);
  const context = useSelector(service, selectors.context);
  const isInvalidTxId = useSelector(service, selectors.isInvalidTxId);
  const isTxNotFound = useSelector(service, selectors.isTxNotFound);
  const isTxReceiptsNotFound = useSelector(
    service,
    selectors.isTxReceiptsNotFound
  );

  const { error, transaction, transactionResult, txId } = context;

  const tx = useParseTx({
    transaction,
    receipts: transactionResult?.receipts,
    gasPerByte: chainInfo?.consensusParameters.gasPerByte,
    gasPriceFactor: chainInfo?.consensusParameters.gasPriceFactor,
    id: txId,
  });
  const isLoadingTx = isFetching || isFetchingResult;

  const { shouldShowAlert, shouldShowTx, shouldShowTxDetails } = useMemo(() => {
    const shouldShowAlert =
      isTxNotFound ||
      isInvalidTxId ||
      tx?.isStatusPending ||
      tx?.isStatusFailure;
    const shouldShowTx =
      tx &&
      !isLoadingTx &&
      !isLoadingChainInfo &&
      !isInvalidTxId &&
      !isTxNotFound;
    const shouldShowTxDetails = shouldShowTx && !tx?.isTypeMint;

    return {
      shouldShowAlert,
      shouldShowTx,
      shouldShowTxDetails,
    };
  }, [
    isTxNotFound,
    isInvalidTxId,
    isLoadingTx,
    tx?.isStatusPending,
    tx?.isStatusFailure,
    tx?.isTypeMint,
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
    isLoadingTx,
    isFetching,
    isFetchingResult,
    isLoadingChainInfo,
    isInvalidTxId,
    isTxNotFound,
    isTxReceiptsNotFound,
    shouldShowAlert,
    shouldShowTx,
    shouldShowTxDetails,
    tx,
    error,
  };
}
