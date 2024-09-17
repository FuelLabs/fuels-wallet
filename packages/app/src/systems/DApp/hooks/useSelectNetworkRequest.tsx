import { useSelector } from '@xstate/react';
import { Services, store } from '~/store';

import type { SelectNetworkRequestMachineState } from '../machines';

const selectors = {
  origin: (state: SelectNetworkRequestMachineState) => state.context.origin,
  title: (state: SelectNetworkRequestMachineState) => state.context.title,
  favIconUrl: (state: SelectNetworkRequestMachineState) =>
    state.context.favIconUrl,
  network: (state: SelectNetworkRequestMachineState) => state.context.network,
  currentNetwork: (state: SelectNetworkRequestMachineState) => {
    return state.context.currentNetwork;
  },
  popup: (state: SelectNetworkRequestMachineState) => state.context.popup,
  isLoading: (state: SelectNetworkRequestMachineState) => {
    return state.hasTag('loading');
  },
};

export function useSelectNetworkRequest() {
  const service = store.useService(Services.selectNetworkRequest);
  const { send } = service;

  const origin = useSelector(service, selectors.origin);
  const title = useSelector(service, selectors.title);
  const favIconUrl = useSelector(service, selectors.favIconUrl);
  const network = useSelector(service, selectors.network);
  const currentNetwork = useSelector(service, selectors.currentNetwork);
  const popup = useSelector(service, selectors.popup);
  const isLoading = useSelector(service, selectors.isLoading);

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
    isLoading,
    origin,
    title,
    favIconUrl,
    popup,
    network,
    currentNetwork,
  };
}
