import type { StoreClass } from '@fuels/react-xstore';
import type { StoreMachines } from '~/store';
import { Services } from '~/store';

import type { AssetInputs } from './services';

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
    reloadListedAssets() {
      store.send(Services.assets, {
        type: 'RELOAD_LISTED_ASSETS',
      });
    },
  };
}
