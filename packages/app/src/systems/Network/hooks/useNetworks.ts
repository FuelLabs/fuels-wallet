import type { StateOf } from '@fuels-wallet/xstore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import type { NetworkInitialInput } from '../machines/networksMachine';
import type { NetworkInputs } from '../services';
import type { Network } from '../types';

import type { Store } from '~/store';
import { useStoreService, useStoreSelector, store, Services } from '~/store';
import { Pages } from '~/systems/Core';

type State = StateOf<Services.networks, Store>;

const selectors = {
  networks: (state: State) => {
    return state.context?.networks || [];
  },
  network: (state: State) => {
    return state.context?.network;
  },
  isLoading: (state: State) => {
    return state.hasTag('loading');
  },
  selectedNetwork: (state: State) => {
    const networks = state.context?.networks || [];
    return networks.find((n) => n.isSelected);
  },
};

export function useNetworks(opts: NetworkInitialInput) {
  const navigate = useNavigate();
  const service = useStoreService(Services.networks);
  const networks = useStoreSelector(service, selectors.networks);
  const network = useStoreSelector(service, selectors.network);
  const isLoading = useStoreSelector(service, selectors.isLoading);
  const selectedNetwork = useStoreSelector(service, selectors.selectedNetwork);

  store.setService(service, {
    actions: {
      redirectToList() {
        navigate(Pages.networks());
      },
      redirectToHome() {
        navigate(Pages.home());
      },
    },
  });

  function goToUpdate(network: Network) {
    navigate(Pages.networkUpdate({ id: network.id }));
  }
  function goToAdd() {
    navigate(Pages.networkAdd());
  }
  function goToList() {
    navigate(Pages.networks());
  }

  function addNetwork(input: NetworkInputs['addNetwork']) {
    store.send(Services.networks, { type: 'ADD_NETWORK', input });
  }
  function updateNetwork(input: NetworkInputs['updateNetwork']) {
    store.send(Services.networks, { type: 'UPDATE_NETWORK', input });
  }
  function removeNetwork(network: Network) {
    store.send(Services.networks, {
      type: 'REMOVE_NETWORK',
      input: { id: network.id! },
    });
  }
  function selectNetwork(network: Network) {
    store.send(Services.networks, {
      type: 'SELECT_NETWORK',
      input: { id: network.id! },
    });
  }

  useEffect(() => {
    store.send(Services.networks, { type: 'SET_INITIAL_DATA', input: opts });
  }, [opts.networkId, opts.type]);

  return {
    handlers: {
      goToUpdate,
      goToAdd,
      goToList,
      addNetwork,
      updateNetwork,
      removeNetwork,
      selectNetwork,
    },
    isLoading,
    selectedNetwork,
    network,
    networks,
  };
}
