import type { NetworkData } from '@fuel-wallet/types';
import { useEffect, useMemo } from 'react';
import { Services, store } from '~/store';
import { useOverlay } from '~/systems/Overlay';

import { DEFAULT_NETWORKS } from '~/networks';
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
    return state.context?.network || undefined;
  },
};

export function useNetworks() {
  const overlay = useOverlay();
  const networks = store.useSelector(Services.networks, selectors.networks);
  const network = store.useSelector(Services.networks, selectors.network);
  const isLoading = store.useSelector(Services.networks, selectors.isLoading);
  const selectedNetworkState = store.useSelector(
    Services.networks,
    selectors.selectedNetwork
  );

  const selectedNetwork = useMemo(() => {
    const networkFromDefault = DEFAULT_NETWORKS.find(
      (n) => n.url === selectedNetworkState?.url
    );

    if (networkFromDefault) {
      return {
        ...selectedNetworkState,
        bridgeUrl: networkFromDefault.bridgeUrl,
        faucetUrl: networkFromDefault.faucetUrl,
      };
    }

    return selectedNetworkState;
  }, [selectedNetworkState]);

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
