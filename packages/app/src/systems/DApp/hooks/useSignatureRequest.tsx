import { useInterpret, useSelector } from '@xstate/react';

import type { SignMachineState } from '../machines';
import { signMachine } from '../machines';

import { useAccount } from '~/systems/Account';

const selectors = {
  isUnlocking: (state: SignMachineState) => state.matches('unlocking'),
  signedMessage: (state: SignMachineState) => state.context.signedMessage,
  isUnlockingLoading: (state: SignMachineState) =>
    state.children.unlock?.state.matches('unlocking'),
};

export function useSignatureRequest() {
  const { account } = useAccount();
  const service = useInterpret(() => signMachine);
  const { send } = service;
  const isUnlocking = useSelector(service, selectors.isUnlocking);
  const isUnlockingLoading = useSelector(service, selectors.isUnlockingLoading);
  const signedMessage = useSelector(service, selectors.signedMessage);

  function sign() {
    send('START_SIGN', { input: { message: 'test' } });
  }

  function unlock(password: string) {
    send('UNLOCK_WALLET', { input: { password, account } });
  }

  function closeUnlock() {
    send('CLOSE_UNLOCK');
  }

  return {
    handlers: {
      sign,
      unlock,
      closeUnlock,
    },
    isUnlocking,
    isUnlockingLoading,
    account,
    signedMessage,
  };
}
