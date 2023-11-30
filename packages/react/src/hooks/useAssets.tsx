import type { Asset } from '@fuel-wallet/sdk';
import { useQuery } from '@tanstack/react-query';

import { useFuel } from '../providers';
import { QUERY_KEYS } from '../utils';

export const useAssets = () => {
  const { fuel } = useFuel();

  const { data, ...queryProps } = useQuery(
    [QUERY_KEYS.assets],
    async () => {
      try {
        const assets = (await fuel.assets()) as Array<Asset>;
        return assets || [];
      } catch (error: unknown) {
        return [];
      }
    },
    {
      initialData: [],
    }
  );

  return {
    assets: data,
    ...queryProps,
  };
};
