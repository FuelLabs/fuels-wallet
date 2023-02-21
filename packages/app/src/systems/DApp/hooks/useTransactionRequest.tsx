import { useSelector } from '@xstate/react';
import { useCallback } from 'react';

import type { TransactionRequestState } from '../machines/transactionRequestMachine';
import { TxRequestStatus } from '../machines/transactionRequestMachine';

import { Services, store } from '~/store';
import { useChainInfo } from '~/systems/Network';
import { getFilteredErrors, TxStatus } from '~/systems/Transaction';
import { useParseTx } from '~/systems/Transaction/hooks/useParseTx';
import type { TxInputs } from '~/systems/Transaction/services';

const selectors = {
  context(state: TransactionRequestState) {
    return state.context;
  },
  account(state: TransactionRequestState) {
    return state.context.input.account;
  },
  isLoadingAccounts(state: TransactionRequestState) {
    return state.matches('fetchingAccount');
  },
  errors(state: TransactionRequestState) {
    if (!state.context.errors) return {};
    const grouped = state.context.errors?.txDryRunGroupedErrors;
    const general = getFilteredErrors(grouped, ['InsufficientInputAmount']);
    const hasGeneral = Boolean(Object.keys(general || {}).length);
    const unlockError = state.context.errors?.unlockError;
    const txApproveError = state.context.errors?.txApproveError;
    return { txApproveError, unlockError, grouped, general, hasGeneral };
  },
  status(externalLoading?: boolean) {
    return useCallback(
      (state: TransactionRequestState) => {
        const isLoading = state.hasTag('loading');
        const isClosed = state.matches('done') || state.matches('failed');

        if (state.matches('idle')) return TxRequestStatus.idle;
        if (externalLoading || isLoading) return TxRequestStatus.loading;
        if (state.matches('txFailed')) return TxRequestStatus.failed;
        if (state.matches('txSuccess')) return TxRequestStatus.success;
        if (state.matches('sendingTx')) return TxRequestStatus.sending;
        if (isClosed) return TxRequestStatus.inactive;
        return TxRequestStatus.waitingApproval;
      },
      [externalLoading]
    );
  },
  title(state: TransactionRequestState) {
    if (state.matches('txSuccess')) return 'Transaction sent';
    if (state.matches('txFailed')) return 'Transaction failed';
    return 'Approve Transaction';
  },
};

type UseTransactionRequestOpts = {
  isOriginRequired?: boolean;
};

export type UseTransactionRequestReturn = ReturnType<
  typeof useTransactionRequest
>;

export function useTransactionRequest(opts: UseTransactionRequestOpts = {}) {
  const service = store.useService(Services.txRequest);

  store.useUpdateMachineConfig(Services.txRequest, {
    context: {
      input: {
        isOriginRequired: opts.isOriginRequired,
      },
    },
  });

  const isLoadingAccounts = useSelector(service, selectors.isLoadingAccounts);
  const account = useSelector(service, selectors.account);
  const ctx = useSelector(service, selectors.context);
  const errors = useSelector(service, selectors.errors);
  const providerUrl = ctx.input.providerUrl;
  const { chainInfo, isLoading: isLoadingChain } = useChainInfo(providerUrl);
  const externalLoading = isLoadingAccounts || isLoadingChain;
  const txStatusSelector = selectors.status(externalLoading);
  const txStatus = useSelector(service, txStatusSelector);
  const title = useSelector(service, selectors.title);
  const isLoading = status('loading');
  const showActions = !status('failed') && !status('success');

  const tx = useParseTx({
    transaction: ctx.input.transactionRequest?.toTransaction(),
    receipts: ctx.response?.receipts,
    gasPerByte: chainInfo?.consensusParameters.gasPerByte,
    gasPriceFactor: chainInfo?.consensusParameters.gasPriceFactor,
  });

  function status(status: keyof typeof TxRequestStatus) {
    return txStatus === status;
  }

  function approveStatus() {
    if (status('success')) return TxStatus.success;
    if (status('failed')) return TxStatus.failure;
    return tx?.status;
  }

  function approve() {
    service.send('APPROVE');
  }
  function reset() {
    service.send('RESET');
  }
  function reject() {
    service.send('REJECT');
  }
  function request(input: TxInputs['request']) {
    service.send('START', { input });
  }
  function tryAgain() {
    service.send('TRY_AGAIN');
  }
  function close() {
    service.send('CLOSE');
  }

  return {
    ...ctx,
    account,
    approveStatus,
    errors,
    isLoading,
    providerUrl,
    showActions,
    status,
    title,
    tx,
    txStatus,
    handlers: {
      request,
      reset,
      approve,
      reject,
      tryAgain,
      close,
    },
  };
}
