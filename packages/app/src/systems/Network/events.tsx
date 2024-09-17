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
