import type { Network } from '@fuels-wallet/types';
import type { StoreClass } from '@fuels-wallet/xstore';

import type { NetworkInitialInput } from './machines';
import type { NetworkInputs } from './services';

import type { StoreMachines } from '~/store';
import { Services } from '~/store';

export function networkEvents(store: StoreClass<StoreMachines>) {
  return {
    addNetwork(input: NetworkInputs['addNetwork']) {
      store.send(Services.networks, {
        type: 'ADD_NETWORK',
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
    initNetworks(input: NetworkInitialInput) {
      store.send('networks', {
        type: 'SET_INITIAL_DATA',
        input,
      });
    },
  };
}
