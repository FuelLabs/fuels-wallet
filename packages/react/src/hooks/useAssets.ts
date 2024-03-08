import type { Asset } from 'fuels';

import { useNamedQuery } from '../core';
import { useFuel } from '../providers';
import { QUERY_KEYS } from '../utils';

export const useAssets = () => {
  const { fuel } = useFuel();

  return useNamedQuery('assets', {
    queryKey: [QUERY_KEYS.assets],
    queryFn: async () => {
      try {
        const assets = (await fuel.assets()) as Array<Asset>;
        return assets || [];
      } catch (error: unknown) {
        return [];
      }
    },
    initialData: [],
  });
};
