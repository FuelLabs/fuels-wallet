import { useInterpret, useSelector } from '@xstate/react';
import { bn } from 'fuels';
import { useCallback, useMemo } from 'react';

import type { TransactionMachineState } from '../machines/transactionMachine';
import {
  TxRequestStatus,
  transactionMachine,
} from '../machines/transactionMachine';
import { useTransactionRequestMethods } from '../methods/transactionRequestMethods';

import { useAccounts } from '~/systems/Account';
import { isEth } from '~/systems/Asset';
import { useChainInfo } from '~/systems/Network';
import { getFilteredErrors } from '~/systems/Transaction';
import { useParseTx } from '~/systems/Transaction/hooks/useParseTx';
import type { TxInputs } from '~/systems/Transaction/services';

const selectors = {
  context(state: TransactionMachineState) {
    return state.context;
  },
  isUnlocking(state: TransactionMachineState) {
    return state.children.unlock?.state.matches('unlocking');
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

        if (state.matches('idle')) return TxRequestStatus.idle;
        if (externalLoading || isLoading) return TxRequestStatus.loading;
        if (selectors.isUnlocking(state)) return TxRequestStatus.unlocking;
        if (state.matches('unlocking')) return TxRequestStatus.waitingUnlock;
        if (state.matches('failed')) return TxRequestStatus.failed;
        if (state.matches('done')) return TxRequestStatus.success;
        if (state.matches('sendingTx')) return TxRequestStatus.sending;
        return TxRequestStatus.waitingApproval;
      },
      [externalLoading]
    );
  },
};

type UseTransactionRequestOpts = {
  isOriginRequired?: boolean;
};

export type UseTransactionRequestReturn = ReturnType<
  typeof useTransactionRequest
>;

export function useTransactionRequest(opts: UseTransactionRequestOpts = {}) {
  const { account, isLoading: isLoadingAccounts } = useAccounts();
  const service = useInterpret(() =>
    transactionMachine.withContext({
      input: {
        isOriginRequired: opts.isOriginRequired,
      },
    })
  );

  const { send } = service;
  const ctx = useSelector(service, selectors.context);
  const errors = useSelector(service, selectors.errors);
  const provider = ctx.input.providerUrl;
  const { chainInfo, isLoading: isLoadingChainInfo } = useChainInfo(provider);
  const externalLoading = isLoadingAccounts || isLoadingChainInfo;
  const txStatusSelector = selectors.status(externalLoading);
  const txStatus = useSelector(service, txStatusSelector);
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

  function approve() {
    send('APPROVE');
  }
  function reset() {
    send('RESET');
  }
  function reject() {
    send('REJECT');
  }
  function unlock(password: string) {
    send('UNLOCK_WALLET', { input: { password, account } });
  }
  function closeUnlock() {
    send('CLOSE_UNLOCK');
  }
  function request(input: TxInputs['request']) {
    send('START_REQUEST', { input });
  }
  function tryAgain() {
    send('TRY_AGAIN');
  }

  useTransactionRequestMethods(service);

  return {
    ...ctx,
    tx,
    txStatus,
    status,
    account,
    ethAmountSent,
    errors,
    isLoading,
    showActions,
    handlers: {
      request,
      reset,
      approve,
      unlock,
      closeUnlock,
      reject,
      tryAgain,
    },
  };
}
