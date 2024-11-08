import type { NetworkData } from '@fuel-wallet/types';
import type { Store } from '~/store';
import { Services } from '~/store';
import type { AddNetworkInput } from './machines';
import type { NetworkInputs } from './services';

export function networkEvents(store: Store) {
  return {
    addNetwork(input: AddNetworkInput) {
      store.send(Services.networks, {
        type: 'ADD_NETWORK',
        input,
      });
    },
    validateAddNetwork(input: NetworkInputs['validateAddNetwork']) {
      store.send(Services.networks, {
        type: 'VALIDATE_ADD_NETWORK',
        input,
      });
    },
    editNetwork(input: NetworkInputs['editNetwork']) {
      store.send(Services.networks, {
        type: 'EDIT_NETWORK',
        input,
      });
    },
    updateNetwork(input: NetworkInputs['updateNetwork']) {
      store.send(Services.networks, {
        type: 'UPDATE_NETWORK',
        input,
      });
    },
    clearChainInfo() {
      store.send(Services.networks, { type: 'CLEAR_CHAIN_INFO' });
    },
    removeNetwork(network: NetworkData) {
      store.send(Services.networks, {
        type: 'REMOVE_NETWORK',
        input: { id: network.id! },
      });
    },
    selectNetwork(network: NetworkData) {
      store.send(Services.networks, {
        type: 'SELECT_NETWORK',
        input: { id: network.id! },
      });
    },
    refreshNetworks() {
      store.send(Services.networks, { type: 'REFRESH_NETWORKS' });
    },
  };
}
