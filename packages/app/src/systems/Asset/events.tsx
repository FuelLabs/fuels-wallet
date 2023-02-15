import type { StoreClass } from '@fuel-wallet/xstore';

import type { AssetInputs } from './services';

import type { StoreMachines } from '~/store';
import { Services } from '~/store';

export function assetEvents(store: StoreClass<StoreMachines>) {
  return {
    upsertAsset(input: AssetInputs['upsertAsset']) {
      store.send(Services.assets, {
        type: 'UPSERT_ASSET',
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
