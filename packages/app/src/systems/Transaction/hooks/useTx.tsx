import { useInterpret, useSelector } from '@xstate/react';
import { bn } from 'fuels';
import { useEffect } from 'react';

import type { TransactionMachineState } from '../machines';
import { TRANSACTION_ERRORS, transactionMachine } from '../machines';
import type { TxInputs } from '../services';

import { useParseTx } from './useParseTx';

import { isEth } from '~/systems/Asset';
import { useChainInfo } from '~/systems/Network';

const selectors = {
  isFetching: (state: TransactionMachineState) => state.matches('fetching'),
  isFetchingResult: (state: TransactionMachineState) =>
    state.matches('fetchingResult'),
  context: (state: TransactionMachineState) => state.context,
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

  const { error, gqlTransactionStatus, transaction, transactionResult, txId } =
    context;

  const tx = useParseTx({
    transaction,
    receipts: transactionResult?.receipts,
    gasPerByte: chainInfo?.consensusParameters.gasPerByte,
    gasPriceFactor: chainInfo?.consensusParameters.gasPriceFactor,
    gqlStatus: gqlTransactionStatus,
    id: txId,
  });

  const isInvalidTxId = error === TRANSACTION_ERRORS.INVALID_ID;
  const isTxNotFound = error === TRANSACTION_ERRORS.NOT_FOUND;
  const isTxReceiptsNotFound = error === TRANSACTION_ERRORS.RECEIPTS_NOT_FOUND;
  const isLoadingTx = isFetching || isFetchingResult || isLoadingChainInfo;
  const shouldShowAlert =
    isTxNotFound || isInvalidTxId || tx?.isStatusPending || tx?.isStatusFailure;
  const shouldShowTx =
    tx && !isFetching && !isLoadingChainInfo && !isInvalidTxId && !isTxNotFound;
  const shouldShowTxDetails = shouldShowTx && !tx?.isTypeMint;

  const ethAmountSent = bn(tx?.totalAssetsSent?.find(isEth)?.amount);

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
    ethAmountSent,
  };
}
