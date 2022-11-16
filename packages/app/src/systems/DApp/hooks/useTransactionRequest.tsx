import { useInterpret, useSelector } from '@xstate/react';
import { bn } from 'fuels';
import { useMemo } from 'react';

import type { TransactionMachineState } from '../machines';
import { transactionMachine } from '../machines';
import { useTransactionRequestMethods } from '../methods';

import { useAccount } from '~/systems/Account';
import { getCoinOutputsFromTx, getGroupedErrors } from '~/systems/Transaction';

const selectors = {
  origin: (state: TransactionMachineState) => state.context.origin,
  unlockError: (state: TransactionMachineState) => state.context.unlockError,
  isUnlocking: (state: TransactionMachineState) => state.matches('unlocking'),
  waitingApproval: (state: TransactionMachineState) =>
    state.matches('waitingApproval'),
  sendingTx: (state: TransactionMachineState) => state.matches('sendingTx'),
  approvedTx: (state: TransactionMachineState) => state.context.approvedTx,
  tx: (state: TransactionMachineState) => state.context.tx,
  fee: (state: TransactionMachineState) => state.context.fee,
  txDryRunError: (state: TransactionMachineState) =>
    state.context.txDryRunError,
  txApproveError: (state: TransactionMachineState) =>
    state.context.txApproveError,
  isUnlockingLoading: (state: TransactionMachineState) =>
    state.children.unlock?.state.matches('unlocking'),
};

export function useTransactionRequest() {
  const { account } = useAccount();
  const service = useInterpret(transactionMachine);
  const { send } = service;
  const isUnlocking = useSelector(service, selectors.isUnlocking);
  const isUnlockingLoading = useSelector(service, selectors.isUnlockingLoading);
  const approvedTx = useSelector(service, selectors.approvedTx);
  const tx = useSelector(service, selectors.tx);
  const fee = useSelector(service, selectors.fee);
  const txDryRunError = useSelector(service, selectors.txDryRunError);
  const txApproveError = useSelector(service, selectors.txApproveError);
  const waitingApproval = useSelector(service, selectors.waitingApproval);
  const sendingTx = useSelector(service, selectors.sendingTx);
  const origin = useSelector(service, selectors.origin);
  const unlockError = useSelector(service, selectors.unlockError);

  const { coinOutputs, outputsToSend, outputAmount } = useMemo(() => {
    const coinOutputs = getCoinOutputsFromTx(tx);
    const outputsToSend = coinOutputs.filter(
      (value) => value.to !== account?.publicKey
    );
    const outputAmount = outputsToSend.reduce(
      (acc, value) => acc.add(value.amount),
      bn(0)
    );

    return { coinOutputs, outputsToSend, outputAmount };
  }, [tx]);

  const groupedErrors = getGroupedErrors(txDryRunError?.response?.errors);

  useTransactionRequestMethods(service);

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

  return {
    handlers: {
      approve,
      unlock,
      closeUnlock,
      reject,
    },
    isUnlocking,
    isUnlockingLoading,
    account,
    approvedTx,
    tx,
    fee,
    txDryRunError,
    txApproveError,
    coinOutputs,
    outputsToSend,
    outputAmount,
    groupedErrors,
    waitingApproval,
    sendingTx,
    origin,
    unlockError,
  };
}
