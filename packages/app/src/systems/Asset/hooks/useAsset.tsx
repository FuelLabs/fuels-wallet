import { Services, store } from '~/store';

import type { AssetsMachineState } from '../machines';

const selectors = {
  asset(name: string) {
    return (state: AssetsMachineState) => {
      return state.context.assets?.find(
        ({ name: contextName }) => contextName === name
      );
    };
  },
};

export function useAsset(name = '') {
  const asset = store.useSelector(Services.assets, selectors.asset(name));

  return asset;
}
