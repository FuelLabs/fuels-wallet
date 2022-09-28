import { useSelector } from '@xstate/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import type { NetworkInitialInput, NetworksMachineState } from '../machines/networksMachine';
import type { NetworkInputs } from '../services';
import type { Network } from '../types';

import { Pages } from '~/systems/Core';
import { useGlobalMachines } from '~/systems/Global';

const selectors = {
  context: (state: NetworksMachineState) => state?.context,
  isLoading: (state: NetworksMachineState) => state?.hasTag('loading'),
  selectedNetwork: (state: NetworksMachineState) => {
    const networks = state?.context?.networks ?? [];
    return networks.find((n) => n.isSelected);
  },
};

export function useNetworks(opts: NetworkInitialInput) {
  const { networksService: service } = useGlobalMachines();
  const context = useSelector(service, selectors.context);
  const isLoading = useSelector(service, selectors.isLoading);
  const selectedNetwork = useSelector(service, selectors.selectedNetwork);
  const navigate = useNavigate();

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
    service.send({ type: 'ADD_NETWORK', input });
  }
  function updateNetwork(input: NetworkInputs['updateNetwork']) {
    service.send({ type: 'UPDATE_NETWORK', input });
  }
  function removeNetwork(network: Network) {
    service.send({ type: 'REMOVE_NETWORK', input: { id: network.id! } });
  }
  function selectNetwork(network: Network) {
    service.send({ type: 'SELECT_NETWORK', input: { id: network.id! } });
  }

  useEffect(() => {
    service.send({ type: 'SET_INITIAL_DATA', input: opts });
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
    ...context,
  };
}
