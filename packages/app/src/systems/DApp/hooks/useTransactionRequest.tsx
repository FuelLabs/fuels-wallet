import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from '@xstate/react';
import { type BN, TransactionStatus, bn } from 'fuels';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Services, store } from '~/store';
import { useOverlay } from '~/systems/Overlay';
import type { TxInputs } from '~/systems/Transaction/services';
import { TxRequestStatus } from '../machines/transactionRequestMachine';
import type { TransactionRequestState } from '../machines/transactionRequestMachine';

const selectors = {
  context(state: TransactionRequestState) {
    return state.context;
  },
  minGasLimit(state: TransactionRequestState) {
    return state.context.fees.minGasLimit;
  },
  maxGasLimit(state: TransactionRequestState) {
    return state.context.fees.maxGasLimit;
  },
  baseFee(state: TransactionRequestState) {
    return state.context.fees.baseFee;
  },
  regularTip(state: TransactionRequestState) {
    return state.context.fees.regularTip;
  },
  fastTip(state: TransactionRequestState) {
    return state.context.fees.fastTip;
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
  isLoadingAccounts(state: TransactionRequestState) {
    return state.matches('fetchingAccount');
  },
  isPreLoading(state: TransactionRequestState) {
    return state.hasTag('preLoading');
  },
  errors(state: TransactionRequestState) {
    if (!state.context.errors) return {};
    const simulateTxErrors = state.context.errors?.simulateTxErrors;
    const hasSimulateTxErrors = Boolean(
      Object.keys(simulateTxErrors || {}).length
    );
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

export type RequestFormValues = {
  fees: {
    tip: {
      amount: BN;
      text: string;
    };
    gasLimit: {
      amount: BN;
      text: string;
    };
  };
};

const DEFAULT_VALUES: RequestFormValues = {
  fees: {
    tip: {
      amount: bn(0),
      text: '0',
    },
    gasLimit: {
      amount: bn(0),
      text: '0',
    },
  },
};

type SchemaOptions = {
  baseFee: BN | undefined;
  minGasLimit: BN | undefined;
  maxGasLimit: BN | undefined;
};

const schema = yup
  .object({
    fees: yup
      .object({
        tip: yup.object({
          amount: yup
            .mixed<BN>()
            .test('min', 'Tip must be greater than or equal to 0', (value) => {
              return value?.gte(0);
            })
            .required('Tip is required'),
          text: yup.string().required('Tip is required'),
        }),
        gasLimit: yup.object({
          amount: yup
            .mixed<BN>()
            .test({
              name: 'min',
              test: (value, ctx) => {
                const { minGasLimit } = ctx.options.context as SchemaOptions;

                if (!minGasLimit || value?.gte(minGasLimit)) {
                  return true;
                }

                return ctx.createError({
                  path: 'fees.gasLimit',
                  message: `Gas limit must be greater than or equal to '${minGasLimit.toString()}'.`,
                });
              },
            })
            .test({
              name: 'max',
              test: (value, ctx) => {
                const { maxGasLimit } = ctx.options.context as SchemaOptions;
                if (!maxGasLimit) return false;

                if (value?.lte(maxGasLimit)) {
                  return true;
                }

                return ctx.createError({
                  path: 'fees.gasLimit',
                  message: `Gas limit must be lower than or equal to '${maxGasLimit.toString()}'.`,
                });
              },
            })
            .required('Gas limit is required'),
          text: yup.string().required('Gas limit is required'),
        }),
      })
      .required('Fees are required'),
  })
  .required();

export function useTransactionRequest(opts: UseTransactionRequestOpts = {}) {
  const service = store.useService(Services.txRequest);

  const baseFee = useSelector(service, selectors.baseFee);
  const minGasLimit = useSelector(service, selectors.minGasLimit);
  const maxGasLimit = useSelector(service, selectors.maxGasLimit);
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
  const origin = useSelector(service, selectors.origin);
  const originTitle = useSelector(service, selectors.originTitle);
  const favIconUrl = useSelector(service, selectors.favIconUrl);
  const isSendingTx = useSelector(service, selectors.sendingTx);
  const isPreLoading = useSelector(service, selectors.isPreLoading);
  const isLoading = status('loading');
  const shouldShowActions = !status('success');
  const shouldShowTxExecuted =
    !!txSummaryExecuted && (status('success') || status('failed'));
  const shouldShowTxSimulated = !shouldShowTxExecuted && !!txSummarySimulated;
  const shouldDisableApproveBtn =
    shouldShowTxSimulated && errors.hasSimulateTxErrors;
  const shouldShowLoader = isPreLoading || !txSummarySimulated;

  const form = useForm<RequestFormValues>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onSubmit',
    defaultValues: DEFAULT_VALUES,
    context: {
      baseFee,
      minGasLimit,
      maxGasLimit,
    },
  });

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

  useEffect(() => {
    const { unsubscribe } = form.watch(() => {
      form.handleSubmit((data) => {
        const { fees } = data;

        const input: TxInputs['setCustomFees'] = {
          tip: fees.tip.amount,
          gasLimit: fees.gasLimit.amount,
        };

        service.send('SET_CUSTOM_FEES', { input });
      })();
    });

    return () => unsubscribe();
  }, [form.watch, form.handleSubmit, service.send]);

  return {
    ...ctx,
    form,
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
