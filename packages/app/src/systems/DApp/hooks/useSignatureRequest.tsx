import { useInterpret, useSelector } from '@xstate/react';

import type { SignMachineState, UnlockMachineState } from '../machines';
import { signMachine } from '../machines';

import { useAccount } from '~/systems/Account';

const selectors = {
  isUnlocking: (state: SignMachineState) => state.matches('unlocking'),
  signedMessage: (state: SignMachineState) => state.context.signedMessage,
  isUnlockingLoading: (state: UnlockMachineState) => state.matches('unlocking'),
};

export function useSignatureRequest() {
  const { account } = useAccount();
  const service = useInterpret(signMachine);
  const { send } = service;
  const state = service.getSnapshot();

  const isUnlocking = useSelector(service, selectors.isUnlocking);
  // not documented way of selecting child state/context
  const isUnlockingLoading = useSelector(
    state.children.unlock || service,
    selectors.isUnlockingLoading
  );
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
