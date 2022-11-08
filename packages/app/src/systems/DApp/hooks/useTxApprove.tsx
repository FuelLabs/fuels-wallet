import { useInterpret, useSelector } from '@xstate/react';
import type { TransactionRequest } from 'fuels';
import { bn } from 'fuels';
import { useMemo } from 'react';

import type { TxApproveMachineState } from '../machines';
import { txApproveMachine } from '../machines';

import { useAccount } from '~/systems/Account';
import { getCoinOutputsFromTx, getGroupedErrors } from '~/systems/Transaction';

const selectors = {
  isUnlocking: (state: TxApproveMachineState) => state.matches('unlocking'),
  isIdle: (state: TxApproveMachineState) => state.matches('idle'),
  isApproving: (state: TxApproveMachineState) => state.matches('approving'),
  approvedTx: (state: TxApproveMachineState) => state.context.approvedTx,
  tx: (state: TxApproveMachineState) => state.context.tx,
  receipts: (state: TxApproveMachineState) => state.context.receipts,
  txDryRunError: (state: TxApproveMachineState) => state.context.txDryRunError,
  txApproveError: (state: TxApproveMachineState) =>
    state.context.txApproveError,
  isUnlockingLoading: (state: TxApproveMachineState) =>
    state.children.unlock?.state.matches('unlocking'),
};

export function useTxApprove() {
  const { account } = useAccount();
  const service = useInterpret(txApproveMachine);
  const { send } = service;
  const isUnlocking = useSelector(service, selectors.isUnlocking);
  const isUnlockingLoading = useSelector(service, selectors.isUnlockingLoading);
  const approvedTx = useSelector(service, selectors.approvedTx);
  const tx = useSelector(service, selectors.tx);
  const receipts = useSelector(service, selectors.receipts);
  const txDryRunError = useSelector(service, selectors.txDryRunError);
  const txApproveError = useSelector(service, selectors.txApproveError);
  const isIdle = useSelector(service, selectors.isIdle);
  const isApproving = useSelector(service, selectors.isApproving);

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

  function startApprove(providerUrl: string) {
    send('START_APPROVE', { input: { providerUrl } });
  }

  function unlock(password: string) {
    send('UNLOCK_WALLET', { input: { password, account } });
  }

  function closeUnlock() {
    send('CLOSE_UNLOCK');
  }

  function calculateGas(tx: TransactionRequest, providerUrl: string) {
    send('CALCULATE_GAS', { input: { tx, providerUrl } });
  }

  return {
    handlers: {
      startApprove,
      unlock,
      closeUnlock,
      calculateGas,
    },
    isUnlocking,
    isUnlockingLoading,
    account,
    approvedTx,
    tx,
    receipts,
    txDryRunError,
    txApproveError,
    coinOutputs,
    outputsToSend,
    outputAmount,
    groupedErrors,
    isIdle,
    isApproving,
  };
}
