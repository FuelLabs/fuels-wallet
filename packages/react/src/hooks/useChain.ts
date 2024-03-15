// should import ChainInfo because of this error: https://github.com/FuelLabs/fuels-ts/issues/1054
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ChainInfo } from 'fuels';

import { useNamedQuery } from '../core';
import { QUERY_KEYS } from '../utils';

import { useProvider } from './useProvider';

export const useChain = () => {
  const { provider } = useProvider();

  return useNamedQuery('chain', {
    queryKey: [QUERY_KEYS.chain],
    queryFn: async () => {
      try {
        const currentFuelChain = await provider?.getChain();
        return currentFuelChain || null;
      } catch (error: unknown) {
        return null;
      }
    },
    initialData: null,
    enabled: !!provider,
  });
};
