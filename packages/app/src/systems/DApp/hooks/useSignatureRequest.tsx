import { useSelector } from '@xstate/react';

import type { MessageRequestState } from '../machines';

import { Services, store } from '~/store';

const selectors = {
  account: (state: MessageRequestState) => state.context.account,
  origin: (state: MessageRequestState) => state.context.origin,
  message: (state: MessageRequestState) => state.context.message,
  signedMessage: (state: MessageRequestState) => state.context.signedMessage,
  isLoading: (state: MessageRequestState) =>
    state.matches('signingMessage') || state.matches('fetchingAccount'),
};

export function useSignatureRequest() {
  const service = store.useService(Services.msgRequest);
  const signedMessage = useSelector(service, selectors.signedMessage);
  const message = useSelector(service, selectors.message);
  const origin = useSelector(service, selectors.origin);
  const account = useSelector(service, selectors.account);
  const isLoading = useSelector(service, selectors.isLoading);

  function sign() {
    service.send('SIGN_MESSAGE');
  }

  function reject() {
    service.send('REJECT');
  }

  return {
    handlers: {
      sign,
      reject,
    },
    origin,
    message,
    account,
    signedMessage,
    isLoading,
  };
}
