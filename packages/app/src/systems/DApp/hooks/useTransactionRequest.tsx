import { useSelector } from '@xstate/react';
import { TransactionStatus } from 'fuels';
import { useCallback } from 'react';
import { Services, store } from '~/store';
import { useOverlay } from '~/systems/Overlay';
import type { TxInputs } from '~/systems/Transaction/services';
import { TxRequestStatus } from '../machines/transactionRequestMachine';
import type { TransactionRequestState } from '../machines/transactionRequestMachine';

const selectors = {
  context(state: TransactionRequestState) {
    return state.context;
  },
  fees(state: TransactionRequestState) {
    return state.context.fees;
  },
  account(state: TransactionRequestState) {
    return state.context.input.account;
  },
  txSummarySimulated(state: TransactionRequestState) {
    return state.context.response?.txSummarySimulated;
  },
  txSummaryExecuted(state: TransactionRequestState) {
    return state.context.response?.txSummaryExecuted;
  },
  proposedTxRequest(state: TransactionRequestState) {
    return state.context.response?.proposedTxRequest;
  },
  isLoadingAccounts(state: TransactionRequestState) {
    return state.matches('fetchingAccount');
  },
  errors(state: TransactionRequestState) {
    if (!state.context.errors) return {};
    const simulateTxErrors = state.context.errors?.simulateTxErrors;
    const hasSimulateTxErrors = Boolean(simulateTxErrors);
    const txApproveError = state.context.errors?.txApproveError;
    return { txApproveError, simulateTxErrors, hasSimulateTxErrors };
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
    if (state.matches('sendingTx')) return 'Sending transaction';
    return 'Review Transaction';
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

  const fees = useSelector(service, selectors.fees);
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
  const txSummarySimulated = useSelector(service, selectors.txSummarySimulated);
  const txSummaryExecuted = useSelector(service, selectors.txSummaryExecuted);
  const proposedTxRequest = useSelector(service, selectors.proposedTxRequest);
  const origin = useSelector(service, selectors.origin);
  const originTitle = useSelector(service, selectors.originTitle);
  const favIconUrl = useSelector(service, selectors.favIconUrl);
  const isSendingTx = useSelector(service, selectors.sendingTx);
  const isLoading = status('loading');
  const shouldShowActions = !status('success');
  const shouldShowTxExecuted =
    !!txSummaryExecuted && (status('success') || status('failed'));
  const shouldShowTxSimulated = !shouldShowTxExecuted && !!txSummarySimulated;
  const shouldDisableApproveBtn =
    shouldShowTxSimulated && errors.hasSimulateTxErrors;

  function closeDialog() {
    reset();
    overlay.close();
  }

  function status(status: keyof typeof TxRequestStatus) {
    return txStatus === status;
  }

  function executedStatus() {
    if (status('success')) return TransactionStatus.success;
    if (status('failed')) return TransactionStatus.failure;
    return txSummarySimulated?.status;
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

  function approve() {
    service.send('APPROVE');
  }

  return {
    ...ctx,
    fees,
    account,
    executedStatus,
    errors,
    isLoading,
    providerUrl,
    status,
    origin,
    originTitle,
    favIconUrl,
    title,
    txSummarySimulated,
    txStatus,
    txSummaryExecuted,
    isSendingTx,
    shouldShowActions,
    shouldDisableApproveBtn,
    shouldShowTxSimulated,
    shouldShowTxExecuted,
    proposedTxRequest,
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
