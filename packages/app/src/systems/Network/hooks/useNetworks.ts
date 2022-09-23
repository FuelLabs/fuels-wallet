import { useSelector } from '@xstate/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import type { NetworkInitialInput, NetworksMachineState } from '../machines/networksMachine';
import type { NetworkInputs } from '../services';
import type { Network } from '../types';

import { useGlobalMachines } from '~/systems/Core';

const selectors = {
  context: (state: NetworksMachineState) => state?.context,
  isLoading: (state: NetworksMachineState) => state?.hasTag('loading'),
};

export function useNetworks(opts: NetworkInitialInput) {
  const { networksService: service } = useGlobalMachines();
  const context = useSelector(service, selectors.context);
  const isLoading = useSelector(service, selectors.isLoading);
  const navigate = useNavigate();

  function goToUpdate(network: Network) {
    navigate(`./update/${network.id}`);
  }
  function goToAdd() {
    navigate('./add');
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
      addNetwork,
      updateNetwork,
      removeNetwork,
      selectNetwork,
    },
    isLoading,
    ...context,
  };
}
