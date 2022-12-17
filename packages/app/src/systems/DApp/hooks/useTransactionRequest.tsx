import { useInterpret, useSelector } from '@xstate/react';
import { bn } from 'fuels';

import type { TransactionMachineState } from '../machines/transactionMachine';
import { transactionMachine } from '../machines/transactionMachine';
import { useTransactionRequestMethods } from '../methods/transactionRequestMethods';

import { useAccounts } from '~/systems/Account';
import { ASSET_LIST } from '~/systems/Asset';
import { useChainInfo } from '~/systems/Network';
import { getFilteredErrors, parseTx } from '~/systems/Transaction';
import type { TxInputs } from '~/systems/Transaction/services';

const selectors = {
  isUnlocking(state: TransactionMachineState) {
    return state.matches('unlocking');
  },
  waitingApproval(state: TransactionMachineState) {
    return state.matches('waitingApproval');
  },
  sendingTx(state: TransactionMachineState) {
    return state.matches('sendingTx');
  },
  isUnlockingLoading(state: TransactionMachineState) {
    return state.children.unlock?.state.matches('unlocking');
  },
  context(state: TransactionMachineState) {
    return state.context;
  },
  isShowingInfo({
    isLoading,
    account,
  }: Omit<ReturnType<typeof useAccounts>, 'handlers' | 'accounts'>) {
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
  const { account, isLoading } = useAccounts();
  const service = useInterpret(() =>
    transactionMachine.withContext({
      isOriginRequired: opts.isOriginRequired,
    })
  );

  const { send } = service;
  const ctx = useSelector(service, selectors.context);
  const isUnlocking = useSelector(service, selectors.isUnlocking);
  const isUnlockingLoading = useSelector(service, selectors.isUnlockingLoading);
  const waitingApproval = useSelector(service, selectors.waitingApproval);
  const sendingTx = useSelector(service, selectors.sendingTx);
  const generalErrors = useSelector(service, selectors.generalErrors);
  const groupedErrors = ctx.txDryRunGroupedErrors;
  const hasGeneralErrors = Boolean(Object.keys(generalErrors || {}).length);
  const isShowingSelector = selectors.isShowingInfo({
    isLoading,
    account,
  });
  const isShowingInfo = useSelector(service, isShowingSelector);

  const { chainInfo } = useChainInfo(ctx.providerUrl);
  const tx = parseTx({
    transaction: ctx.transactionRequest?.toTransaction(),
    receipts: ctx.receipts,
    gasPerByte: chainInfo?.consensusParameters.gasPerByte,
    gasPriceFacor: chainInfo?.consensusParameters.gasPriceFactor,
  });
  const ethAmountSent = bn(
    tx.totalAssetsSent?.find(({ assetId }) => assetId === ASSET_LIST[0].assetId)
      ?.amount
  );

  function approve() {
    send('APPROVE');
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

  useTransactionRequestMethods(service);

  return {
    handlers: {
      request,
      approve,
      unlock,
      closeUnlock,
      reject,
    },
    account,
    isLoading,
    isUnlocking,
    isUnlockingLoading,
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
