import type { Asset } from '@fuel-wallet/sdk';
import { useMutation } from '@tanstack/react-query';

import { useFuel } from '../providers';
import { MUTATION_KEYS } from '../utils';

export const useAddAssets = () => {
  const { fuel } = useFuel();

  const { mutate, mutateAsync, ...queryProps } = useMutation(
    [MUTATION_KEYS.addAssets],
    async (assets: Asset | Asset[]) => {
      if (Array.isArray(assets)) {
        return fuel.addAssets(assets);
      }
      return fuel.addAsset(assets);
    }
  );

  return {
    addAssets: (assets: Asset | Asset[]) => mutate(assets),
    addAssetsAsync: (assets: Asset | Asset[]) => mutateAsync(assets),
    ...queryProps,
  };
};
