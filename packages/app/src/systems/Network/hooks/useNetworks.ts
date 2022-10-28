import type { Network } from '@fuels-wallet/types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import type {
  NetworkInitialInput,
  NetworksMachineState,
} from '../machines/networksMachine';

import { store, Services } from '~/store';
import { Pages } from '~/systems/Core';

const selectors = {
  networks: (state: NetworksMachineState) => {
    return state.context?.networks || [];
  },
  network: (state: NetworksMachineState) => {
    return state.context?.network;
  },
  isLoading: (state: NetworksMachineState) => {
    return state.hasTag('loading');
  },
  selectedNetwork: (state: NetworksMachineState) => {
    const networks = state.context?.networks || [];
    return networks.find((n) => n.isSelected) as Network;
  },
};

export function useNetworks(opts: NetworkInitialInput) {
  const navigate = useNavigate();
  const networks = store.useSelector(Services.networks, selectors.networks);
  const network = store.useSelector(Services.networks, selectors.network);
  const isLoading = store.useSelector(Services.networks, selectors.isLoading);
  const selectedNetwork = store.useSelector(
    Services.networks,
    selectors.selectedNetwork
  );

  store.useSetMachineConfig(Services.networks, {
    actions: {
      redirectToList() {
        navigate(Pages.networks());
      },
      redirectToHome() {
        navigate(Pages.wallet());
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

  useEffect(() => {
    store.initNetworks(opts);
  }, [opts.networkId, opts.type]);

  return {
    handlers: {
      goToUpdate,
      goToAdd,
      goToList,
      addNetwork: store.addNetwork,
      updateNetwork: store.updateNetwork,
      removeNetwork: store.removeNetwork,
      selectNetwork: store.selectNetwork,
    },
    isLoading,
    selectedNetwork,
    network,
    networks,
  };
}
