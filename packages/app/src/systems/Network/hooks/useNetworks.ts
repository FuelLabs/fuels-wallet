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
  editingNetwork: (id: string) => (state: NetworksMachineState) => {
    return (
      (id && state.context?.networks?.find((n) => n.id === id)) || undefined
    );
  },
  reviewingAddNetwork: (state: NetworksMachineState) => {
    return state.hasTag('reviewingAddNetwork');
  },
  chainInfoToAdd: (state: NetworksMachineState) => {
    return state.context?.chainInfoToAdd;
  },
  loadingChainInfo: (state: NetworksMachineState) => {
    return state.hasTag('loadingChainInfo');
  },
  chainInfoError: (state: NetworksMachineState) => {
    return state.context?.chainInfoError;
  },
};

export function useNetworks() {
  const overlay = useOverlay();
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const selectedNetworkId = (overlay.metadata as any)?.id;
  const networks = store.useSelector(Services.networks, selectors.networks);
  const network = store.useSelector(Services.networks, selectors.network);
  const isLoading = store.useSelector(Services.networks, selectors.isLoading);
  const isLoadingChainInfo = store.useSelector(
    Services.networks,
    selectors.loadingChainInfo
  );
  const isReviewingAddNetwork = store.useSelector(
    Services.networks,
    selectors.reviewingAddNetwork
  );
  const editingNetwork = store.useSelector(
    Services.networks,
    useMemo(
      () => selectors.editingNetwork(selectedNetworkId),
      [selectedNetworkId]
    )
  );
  const selectedNetworkState = store.useSelector(
    Services.networks,
    selectors.selectedNetwork
  );
  const chainInfoToAdd = store.useSelector(
    Services.networks,
    selectors.chainInfoToAdd
  );
  const chainInfoError = store.useSelector(
    Services.networks,
    selectors.chainInfoError
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
      } as NetworkData;
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
    store.openNetworkUpdate({ id });
  }

  return {
    handlers: {
      closeDialog,
      goToUpdate,
      validateAddNetwork: store.validateAddNetwork,
      addNetwork: store.addNetwork,
      openNetworks: store.openNetworksList,
      openNetworksAdd: store.openNetworksAdd,
      removeNetwork: store.removeNetwork,
      selectNetwork: store.selectNetwork,
      updateNetwork: store.updateNetwork,
      clearChainInfo: store.clearChainInfo,
    },
    isLoading,
    isLoadingChainInfo,
    isReviewingAddNetwork,
    chainInfoToAdd,
    selectedNetwork,
    editingNetwork,
    network,
    networks,
    chainInfoError,
  };
}
