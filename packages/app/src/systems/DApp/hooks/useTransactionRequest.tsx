import { useInterpret, useSelector } from '@xstate/react';
import { bn } from 'fuels';
import { useMemo } from 'react';

import type { TransactionMachineState } from '../machines/transactionMachine';
import { transactionMachine } from '../machines/transactionMachine';
import { useTransactionRequestMethods } from '../methods/transactionRequestMethods';

import { store } from '~/store';
import { useAccounts } from '~/systems/Account';
import { isEth } from '~/systems/Asset';
import { useChainInfo } from '~/systems/Network';
import { getFilteredErrors } from '~/systems/Transaction';
import { useParseTx } from '~/systems/Transaction/hooks/useParseTx';
import type { TxInputs } from '~/systems/Transaction/services';

const selectors = {
  waitingApproval(state: TransactionMachineState) {
    return state.matches('waitingApproval');
  },
  sendingTx(state: TransactionMachineState) {
    return state.matches('sendingTx');
  },
  isLoadingTransaction(state: TransactionMachineState) {
    return state.hasTag('loading');
  },
  context(state: TransactionMachineState) {
    return state.context;
  },
  isShowingInfo({
    isLoading,
    account,
  }: Partial<ReturnType<typeof useAccounts>>) {
    return (state: TransactionMachineState) =>
      !isLoading &&
      !state.context.approvedTx &&
      !state.context.txApproveError &&
      state.context.origin &&
      account;
  },
  generalErrors(state: TransactionMachineState) {
    const groupedErrors = state.context.txDryRunGroupedErrors;
    return getFilteredErrors(groupedErrors, ['InsufficientInputAmount']);
  },
};

type UseTransactionRequestOpts = {
  isOriginRequired?: boolean;
};

export function useTransactionRequest(opts: UseTransactionRequestOpts = {}) {
  const { account, isLoading: isLoadingAccounts } = useAccounts();
  const service = useInterpret(() =>
    transactionMachine.withContext({
      isOriginRequired: opts.isOriginRequired,
    })
  );

  const { send } = service;
  const ctx = useSelector(service, selectors.context);
  const waitingApproval = useSelector(service, selectors.waitingApproval);
  const sendingTx = useSelector(service, selectors.sendingTx);
  const generalErrors = useSelector(service, selectors.generalErrors);
  const isLoadingTransaction = useSelector(
    service,
    selectors.isLoadingTransaction
  );
  const { chainInfo, isLoading: isLoadingChainInfo } = useChainInfo(
    ctx.providerUrl
  );
  const groupedErrors = ctx.txDryRunGroupedErrors;
  const hasGeneralErrors = Boolean(Object.keys(generalErrors || {}).length);
  const isLoadingTx =
    isLoadingTransaction || isLoadingAccounts || isLoadingChainInfo;

  const isShowingSelector = selectors.isShowingInfo({
    isLoading: isLoadingTx,
    account,
  });
  const isShowingInfo = useSelector(service, isShowingSelector);

  const tx = useParseTx({
    transaction: ctx.transactionRequest?.toTransaction(),
    receipts: ctx.receipts,
    gasPerByte: chainInfo?.consensusParameters.gasPerByte,
    gasPriceFactor: chainInfo?.consensusParameters.gasPriceFactor,
  });

  const ethAmountSent = useMemo(
    () => bn(tx?.totalAssetsSent?.find(isEth)?.amount),
    [tx?.totalAssetsSent]
  );

  function approve() {
    store.unlock({
      onSuccess() {
        send('APPROVE');
      },
    });
  }
  function reject() {
    send('REJECT');
  }
  function request(input: TxInputs['request']) {
    send('START_REQUEST', { input });
  }

  useTransactionRequestMethods(service);

  return {
    handlers: {
      request,
      approve,
      reject,
    },
    account,
    isLoadingTx,
    sendingTx,
    waitingApproval,
    isShowingInfo,
    groupedErrors,
    generalErrors,
    hasGeneralErrors,
    tx,
    ethAmountSent,
    ...ctx,
  };
}
