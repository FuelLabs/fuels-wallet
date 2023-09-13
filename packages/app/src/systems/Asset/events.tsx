import type { StoreClass } from '@fuels/react-xstore';

import type { AssetInputs } from './services';

import type { StoreMachines } from '~/store';
import { Services } from '~/store';

export function assetEvents(store: StoreClass<StoreMachines>) {
  return {
    addAsset(input: AssetInputs['addAsset']) {
      store.send(Services.assets, {
        type: 'ADD_ASSET',
        input,
      });
    },
    updateAsset(input: AssetInputs['updateAsset']) {
      store.send(Services.assets, {
        type: 'UPDATE_ASSET',
        input,
      });
    },
    removeAsset(input: AssetInputs['removeAsset']) {
      store.send(Services.assets, {
        type: 'REMOVE_ASSET',
        input,
      });
    },
  };
}
