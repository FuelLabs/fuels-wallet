import { Services, store } from '~/store';

import type { AssetsMachineState } from '../machines';

const selectors = {
  asset(assetId: string) {
    return (state: AssetsMachineState) => {
      return state.context.assets?.find(
        ({ assetId: contextAssetId }) => contextAssetId === assetId
      );
    };
  },
};

export function useAsset(assetId = '') {
  const asset = store.useSelector(Services.assets, selectors.asset(assetId));

  return asset;
}
