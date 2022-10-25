import { useMachine, useSelector } from '@xstate/react';
import { useEffect } from 'react';

import type { TxMachineState } from '../machines/txMachine';
import { txMachine } from '../machines/txMachine';
import type { TxRequest } from '../types';

import { useAccount } from '~/systems/Account';

const selectors = {
  txRequest(state: TxMachineState) {
    return state.context.tx?.data as TxRequest;
  },
  simulateResult(state: TxMachineState) {
    return state.context.simulateResult;
  },
  isLoading(state: TxMachineState) {
    return state.hasTag('loading');
  },
  isSent(state: TxMachineState) {
    return state.matches('sent');
  },
};

export function useTransaction(id: string) {
  const wallet = undefined;
  const isLocked = true;
  const { isLoading } = useAccount();
  const [, send, service] = useMachine(() => txMachine);

  const txRequest = useSelector(service, selectors.txRequest);
  const simulateResult = useSelector(service, selectors.simulateResult);
  const isLoadingTx = useSelector(service, selectors.isLoading);
  const isSent = useSelector(service, selectors.isSent);

  function simulate() {
    send('SIMULATE');
  }

  function approve() {
    send('APPROVE');
  }

  useEffect(() => {
    if (!isLocked && !isLoading && wallet) {
      send('GET_TRANSACTION', { input: { wallet, id } });
    }
  }, [isLocked, isLoading, wallet]);

  return {
    txRequest,
    simulateResult,
    isSent,
    isLoading: isLoadingTx,
    handlers: {
      simulate,
      approve,
    },
  };
}
