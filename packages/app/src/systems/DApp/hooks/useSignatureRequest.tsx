import { useInterpret, useSelector } from '@xstate/react';

import type { SignMachineState } from '../machines';
import { signMachine } from '../machines';
import { useSignRequestMethods } from '../methods';

import { useAccounts } from '~/systems/Account';

const selectors = {
  origin: (state: SignMachineState) => state.context.origin,
  unlockError: (state: SignMachineState) => state.context.unlockError,
  message: (state: SignMachineState) => state.context.message,
  isUnlocking: (state: SignMachineState) => state.matches('unlocking'),
  signedMessage: (state: SignMachineState) => state.context.signedMessage,
  isUnlockingLoading: (state: SignMachineState) =>
    state.children.unlock?.state.matches('unlocking'),
};

export function useSignatureRequest() {
  const { account } = useAccounts();
  const service = useInterpret(() => signMachine);
  const { send } = service;
  const isUnlocking = useSelector(service, selectors.isUnlocking);
  const isUnlockingLoading = useSelector(service, selectors.isUnlockingLoading);
  const signedMessage = useSelector(service, selectors.signedMessage);
  const message = useSelector(service, selectors.message);
  const unlockError = useSelector(service, selectors.unlockError);
  const origin = useSelector(service, selectors.origin);

  // Start Connect Request Methods
  useSignRequestMethods(service);

  function sign() {
    send('SIGN_MESSAGE');
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
      sign,
      reject,
      unlock,
      closeUnlock,
    },
    origin,
    message,
    isUnlocking,
    isUnlockingLoading,
    account,
    signedMessage,
    unlockError,
  };
}
