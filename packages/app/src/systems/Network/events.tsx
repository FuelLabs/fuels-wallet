import type { Network } from '@fuel-wallet/types';

import type { NetworkInputs } from './services';

import type { Store } from '~/store';
import { Services } from '~/store';

export function networkEvents(store: Store) {
  return {
    addNetwork(input: NetworkInputs['addNetwork']) {
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
    removeNetwork(network: Network) {
      store.send(Services.networks, {
        type: 'REMOVE_NETWORK',
        input: { id: network.id! },
      });
    },
    selectNetwork(network: Network) {
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
