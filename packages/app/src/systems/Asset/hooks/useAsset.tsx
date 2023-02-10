import type { AssetsMachineState } from '../machines';

import { Services, store } from '~/store';

const selectors = {
  asset(assetId: string) {
    return (state: AssetsMachineState) => {
      return state.context.assets?.find(
        ({ assetId: contextAssetId }) => contextAssetId === assetId
      );
    };
  },
};

export function useAsset(assetId: string = '') {
  const asset = store.useSelector(Services.assets, selectors.asset(assetId));

  return asset;
}
