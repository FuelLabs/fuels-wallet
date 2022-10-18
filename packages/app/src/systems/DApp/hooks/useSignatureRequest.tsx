import { useMachine, useSelector } from '@xstate/react';

import type { SignMachineState } from '../machines';
import { signMachine } from '../machines';

import { useAccount } from '~/systems/Account';

const selectors = {
  isUnlocking: (state: SignMachineState) => state.matches('unlocking'),
  isUnlockingLoading: (state: SignMachineState) => state.context.loadingUnlock,
  signedMessage: (state: SignMachineState) => state.context.signedMessage,
};

export function useSignatureRequest() {
  const { account } = useAccount();
  const [, send, service] = useMachine(signMachine);

  const isUnlocking = useSelector(service, selectors.isUnlocking);
  const isUnlockingLoading = useSelector(service, selectors.isUnlockingLoading);
  const signedMessage = useSelector(service, selectors.signedMessage);

  function sign() {
    send('START_SIGN', { input: { message: 'test' } });
  }

  function unlock(password: string) {
    send('UNLOCK_WALLET', { input: { password, account } });
  }

  return {
    handlers: {
      sign,
      unlock,
    },
    isUnlocking,
    isUnlockingLoading,
    account,
    signedMessage,
  };
}
