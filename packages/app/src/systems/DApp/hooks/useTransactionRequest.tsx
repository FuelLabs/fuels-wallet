import { useInterpret, useSelector } from '@xstate/react';
import { bn } from 'fuels';
import { useCallback, useMemo } from 'react';

import type { TransactionMachineState } from '../machines/transactionMachine';
import {
  TxRequestStatus,
  transactionMachine,
} from '../machines/transactionMachine';
import { useTransactionRequestMethods } from '../methods/transactionRequestMethods';

import { isEth } from '~/systems/Asset';
import { useChainInfo } from '~/systems/Network';
import { getFilteredErrors, TxStatus } from '~/systems/Transaction';
import { useParseTx } from '~/systems/Transaction/hooks/useParseTx';
import type { TxInputs } from '~/systems/Transaction/services';

const selectors = {
  context(state: TransactionMachineState) {
    return state.context;
  },
  account(state: TransactionMachineState) {
    return state.context.input.account;
  },
  isUnlocking(state: TransactionMachineState) {
    return state.children.unlock?.state.matches('unlocking');
  },
  isLoadingAccounts(state: TransactionMachineState) {
    return state.matches('fetchingAccount');
  },
  errors(state: TransactionMachineState) {
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
      (state: TransactionMachineState) => {
        const isLoading = state.hasTag('loading');
        const isClosed = state.matches('done') || state.matches('failed');

        if (state.matches('idle')) return TxRequestStatus.idle;
        if (externalLoading || isLoading) return TxRequestStatus.loading;
        if (selectors.isUnlocking(state)) return TxRequestStatus.unlocking;
        if (state.matches('unlocking')) return TxRequestStatus.waitingUnlock;
        if (state.matches('txFailed')) return TxRequestStatus.failed;
        if (state.matches('txSuccess')) return TxRequestStatus.success;
        if (state.matches('sendingTx')) return TxRequestStatus.sending;
        if (isClosed) return TxRequestStatus.inactive;
        return TxRequestStatus.waitingApproval;
      },
      [externalLoading]
    );
  },
  title(state: TransactionMachineState) {
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
  const service = useInterpret(() =>
    transactionMachine
      .withConfig({
        actions: {
          closeWindow: () => {
            window.close();
          },
        },
      })
      .withContext({
        input: {
          isOriginRequired: opts.isOriginRequired,
        },
      })
  );

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

  const ethAmountSent = useMemo(
    () => bn(tx?.totalAssetsSent?.find(isEth)?.amount),
    [tx?.totalAssetsSent]
  );

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
  function unlock(password: string) {
    service.send('UNLOCK_WALLET', { input: { password, account } });
  }
  function closeUnlock() {
    service.send('CLOSE_UNLOCK');
  }
  function request(input: TxInputs['request']) {
    service.send('START_REQUEST', { input });
  }
  function tryAgain() {
    service.send('TRY_AGAIN');
  }
  function close() {
    service.send('CLOSE');
  }

  useTransactionRequestMethods(service);

  return {
    ...ctx,
    account,
    approveStatus,
    errors,
    ethAmountSent,
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
      unlock,
      closeUnlock,
      reject,
      tryAgain,
      close,
    },
  };
}
