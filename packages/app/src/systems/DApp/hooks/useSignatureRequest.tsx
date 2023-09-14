import { useSelector } from '@xstate/react';
import { Services, store } from '~/store';

import type { MessageRequestState } from '../machines';

const selectors = {
  account: (state: MessageRequestState) => state.context.account,
  origin: (state: MessageRequestState) => state.context.origin,
  message: (state: MessageRequestState) => state.context.message,
  signedMessage: (state: MessageRequestState) => state.context.signedMessage,
  isLoading: (state: MessageRequestState) =>
    state.matches('signingMessage') || state.matches('fetchingAccount'),
  title: (state: MessageRequestState) => state.context.title,
  favIconUrl: (state: MessageRequestState) => state.context.favIconUrl,
};

export function useSignatureRequest() {
  const service = store.useService(Services.msgRequest);
  const signedMessage = useSelector(service, selectors.signedMessage);
  const message = useSelector(service, selectors.message);
  const origin = useSelector(service, selectors.origin);
  const account = useSelector(service, selectors.account);
  const isLoading = useSelector(service, selectors.isLoading);
  const title = useSelector(service, selectors.title);
  const favIconUrl = useSelector(service, selectors.favIconUrl);

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
    title,
    favIconUrl,
    message,
    account,
    signedMessage,
    isLoading,
  };
}
