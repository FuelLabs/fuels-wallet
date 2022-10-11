import { useMachine } from '@xstate/react';
import { useEffect } from 'react';

import { txMachine } from '../machines/txMachine';
import type { TxRequest } from '../types';

import { useAccount } from '~/systems/Account';

export function useSimulateTx(tx: TxRequest) {
  const { wallet, isLocked, isLoading } = useAccount();
  const [state, send] = useMachine(() => txMachine);

  useEffect(() => {
    if (!isLocked && !isLoading) {
      send('SIMULATE', { input: { tx, wallet } });
    }
  }, [isLoading, isLocked, wallet]);

  return {
    ...state.context,
  };
}
