import { useSelector } from '@xstate/react';

import type { AddNetworkMachineState } from '../machines';

import { Services, store } from '~/store';

const selectors = {
  origin: (state: AddNetworkMachineState) => state.context.origin,
  title: (state: AddNetworkMachineState) => state.context.title,
  favIconUrl: (state: AddNetworkMachineState) => state.context.favIconUrl,
  network: (state: AddNetworkMachineState) => state.context.network,
};

export function useAddNetworkRequest() {
  const service = store.useService(Services.addNetworkRequest);
  const { send } = service;

  const origin = useSelector(service, selectors.origin);
  const title = useSelector(service, selectors.title);
  const favIconUrl = useSelector(service, selectors.favIconUrl);
  const network = useSelector(service, selectors.network);

  function approve() {
    send('APPROVE');
  }

  function reject() {
    send('REJECT');
  }

  return {
    handlers: {
      approve,
      reject,
    },
    origin,
    title,
    favIconUrl,
    network,
  };
}
