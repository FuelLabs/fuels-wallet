import { useSelector } from '@xstate/react';
import { TransactionStatus } from 'fuels';
import { useCallback } from 'react';
import { Services, store } from '~/store';
import { useOverlay } from '~/systems/Overlay';
import { getFilteredErrors } from '~/systems/Transaction';
import type { TxInputs } from '~/systems/Transaction/services';

import { TxRequestStatus } from '../machines/transactionRequestMachine';
import type { TransactionRequestState } from '../machines/transactionRequestMachine';

const selectors = {
  context(state: TransactionRequestState) {
    return state.context;
  },
  account(state: TransactionRequestState) {
    return state.context.input.account;
  },
  txResult(state: TransactionRequestState) {
    return state.context.response?.txResult;
  },
  isLoadingAccounts(state: TransactionRequestState) {
    return state.matches('fetchingAccount');
  },
  isPreLoading(state: TransactionRequestState) {
    return state.hasTag('preLoading');
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
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
      [externalLoading],
    );
  },
  title(state: TransactionRequestState) {
    if (state.matches('txSuccess')) return 'Transaction sent';
    if (state.matches('txFailed')) return 'Transaction failed';
    if (state.matches('sendingTx')) return 'Sending transaction';
    return 'Approve Transaction';
  },
  origin: (state: TransactionRequestState) => state.context.input.origin,
  originTitle: (state: TransactionRequestState) => state.context.input.title,
  favIconUrl: (state: TransactionRequestState) =>
    state.context.input.favIconUrl,
  sendingTx: (state: TransactionRequestState) => state.matches('sendingTx'),
};

type UseTransactionRequestOpts = {
  isOriginRequired?: boolean;
};

export type UseTransactionRequestReturn = ReturnType<
  typeof useTransactionRequest
>;

export function useTransactionRequest(opts: UseTransactionRequestOpts = {}) {
  const service = store.useService(Services.txRequest);
  const overlay = useOverlay();

  store.useUpdateMachineConfig(Services.txRequest, {
    context: {
      input: {
        isOriginRequired: opts.isOriginRequired,
      },
    },
    actions: {
      openDialog() {
        if (!opts.isOriginRequired) {
          store.openTransactionApprove();
        }
      },
    },
  });

  const isLoadingAccounts = useSelector(service, selectors.isLoadingAccounts);
  const account = useSelector(service, selectors.account);
  const ctx = useSelector(service, selectors.context);
  const errors = useSelector(service, selectors.errors);
  const providerUrl = ctx.input.providerUrl;
  const txStatusSelector = selectors.status(isLoadingAccounts);
  const txStatus = useSelector(service, txStatusSelector);
  const title = useSelector(service, selectors.title);
  const txResult = useSelector(service, selectors.txResult);
  const origin = useSelector(service, selectors.origin);
  const originTitle = useSelector(service, selectors.originTitle);
  const favIconUrl = useSelector(service, selectors.favIconUrl);
  const isSendingTx = useSelector(service, selectors.sendingTx);
  const isPreLoading = useSelector(service, selectors.isPreLoading);
  const isLoading = status('loading');
  const showActions = !status('failed') && !status('success');
  const shouldShowTx = (status('waitingApproval') || isSendingTx) && !!txResult;
  const shouldShowLoader = isPreLoading || !txResult;

  function closeDialog() {
    reset();
    overlay.close();
  }

  function status(status: keyof typeof TxRequestStatus) {
    return txStatus === status;
  }

  function approveStatus() {
    if (status('success')) return TransactionStatus.success;
    if (status('failed')) return TransactionStatus.failure;
    return txResult?.status;
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
    origin,
    originTitle,
    favIconUrl,
    title,
    txResult,
    txStatus,
    isSendingTx,
    shouldShowTx,
    shouldShowLoader,
    handlers: {
      request,
      reset,
      approve,
      reject,
      tryAgain,
      close,
      closeDialog,
      openDialog: store.openTransactionApprove,
    },
  };
}
