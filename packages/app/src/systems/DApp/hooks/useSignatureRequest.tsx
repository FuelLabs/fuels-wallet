import { useInterpret, useSelector } from '@xstate/react';

import type { SignMachineState } from '../machines';
import { signMachine } from '../machines';
import { useSignRequestMethods } from '../methods';

import { store } from '~/store';
import { useAccounts } from '~/systems/Account';

const selectors = {
  origin: (state: SignMachineState) => state.context.origin,
  message: (state: SignMachineState) => state.context.message,
  signedMessage: (state: SignMachineState) => state.context.signedMessage,
};

export function useSignatureRequest() {
  const { account } = useAccounts();
  const service = useInterpret(() => signMachine);
  const signedMessage = useSelector(service, selectors.signedMessage);
  const message = useSelector(service, selectors.message);
  const origin = useSelector(service, selectors.origin);

  function sign() {
    store.unlock({
      onSuccess() {
        service.send('SIGN_MESSAGE');
      },
    });
  }
  function reject() {
    service.send('REJECT');
  }

  // Start Connect Request Methods
  useSignRequestMethods(service);

  return {
    handlers: {
      sign,
      reject,
    },
    origin,
    message,
    account,
    signedMessage,
  };
}
