import { useInterpret, useSelector } from '@xstate/react';
import { bn } from 'fuels';
import { useEffect } from 'react';

import type { TransactionMachineState } from '../machines';
import { TRANSACTION_ERRORS, transactionMachine } from '../machines';
import type { TxInputs } from '../services';
import { processTx } from '../utils';

import { ASSET_LIST } from '~/systems/Asset';
import { useChainInfo } from '~/systems/Network';

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
  const { chainInfo } = useChainInfo(providerUrl);
  const service = useInterpret(() => transactionMachine);
  const { send } = service;
  const isFetching = useSelector(service, selectors.isFetching);
  const isFetchingResult = useSelector(service, selectors.isFetchingResult);
  const context = useSelector(service, selectors.context);

  const { error, gqlTransactionStatus, transaction, transactionResult, txId } =
    context;

  const tx = processTx({
    transaction,
    receipts: transactionResult?.receipts,
    gasPerByte: chainInfo?.consensusParameters.gasPerByte,
    gasPriceFacor: chainInfo?.consensusParameters.gasPriceFactor,
    gqlStatus: gqlTransactionStatus,
    id: txId,
  });
  const { isTypeMint, isStatusFailure, isStatusPending } = tx;

  const isInvalidTxId = error === TRANSACTION_ERRORS.INVALID_ID;
  const isTxNotFound = error === TRANSACTION_ERRORS.NOT_FOUND;
  const isTxReceiptsNotFound = error === TRANSACTION_ERRORS.RECEIPTS_NOT_FOUND;
  const isFetchingDetails = isFetching || isFetchingResult;
  const shouldShowAlert =
    isTxNotFound || isInvalidTxId || isStatusPending || isStatusFailure;
  const shouldShowTx =
    transaction && !isFetching && !isInvalidTxId && !isTxNotFound;
  const shouldShowTxDetails = shouldShowTx && !isFetchingResult && !isTypeMint;

  const amountSent = bn(
    tx.totalAssetsSent.find(({ assetId }) => assetId === ASSET_LIST[0].assetId)
      ?.amount
  );

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
    isInvalidTxId,
    isTxNotFound,
    isTxReceiptsNotFound,
    shouldShowAlert,
    shouldShowTx,
    shouldShowTxDetails,
    tx,
    error,
    amountSent,
  };
}
