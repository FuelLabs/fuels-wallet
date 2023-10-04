import type { Network } from '@fuel-wallet/types';
import { useEffect } from 'react';
import { store, Services } from '~/store';
import { useOverlay } from '~/systems/Overlay';

import type { NetworksMachineState } from '../machines/networksMachine';

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

export function useNetworks() {
  const overlay = useOverlay();
  const networks = store.useSelector(Services.networks, selectors.networks);
  const network = store.useSelector(Services.networks, selectors.network);
  const isLoading = store.useSelector(Services.networks, selectors.isLoading);
  const selectedNetwork = store.useSelector(
    Services.networks,
    selectors.selectedNetwork
  );

  useEffect(() => {
    store.refreshNetworks();
  }, []);

  store.useUpdateMachineConfig(Services.networks, {
    actions: {
      redirectToList() {
        store.openNetworksList();
      },
      redirectToHome() {
        closeDialog();
      },
    },
  });

  function closeDialog() {
    overlay.close();
  }
  function goToUpdate(id?: string) {
    if (!id) return;
    store.editNetwork({ id });
    store.openNetworkUpdate();
  }

  return {
    handlers: {
      closeDialog,
      goToUpdate,
      addNetwork: store.addNetwork,
      openNetworks: store.openNetworksList,
      openNetworksAdd: store.openNetworksAdd,
      removeNetwork: store.removeNetwork,
      selectNetwork: store.selectNetwork,
      updateNetwork: store.updateNetwork,
    },
    isLoading,
    selectedNetwork,
    network,
    networks,
  };
}
