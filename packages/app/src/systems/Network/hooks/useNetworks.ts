import type { Network } from '@fuel-wallet/types';

import type { NetworksMachineState } from '../machines/networksMachine';

import { store, Services } from '~/store';
import { useOverlay } from '~/systems/Overlay';

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
  function goToUpdate(network: Network) {
    store.editNetwork({ id: network.id as string });
    overlay.open('networks.update');
  }

  return {
    handlers: {
      closeDialog,
      goToUpdate,
      goToAdd: store.openNetworksAdd,
      goToList: store.openNetworksList,
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
