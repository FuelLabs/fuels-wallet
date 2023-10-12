import { useQuery } from '@tanstack/react-query';
// should import ChainInfo because of this error: https://github.com/FuelLabs/fuels-ts/issues/1054
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ChainInfo } from 'fuels';

import { QUERY_KEYS } from '../utils';

import { useProvider } from './useProvider';

export const useChain = () => {
  const { provider } = useProvider();

  const query = useQuery(
    [QUERY_KEYS.chain],
    async () => {
      try {
        const currentFuelChain = await provider?.getChain();
        return currentFuelChain || null;
      } catch (error: unknown) {
        return null;
      }
    },
    {
      enabled: !!provider,
    },
  );

  return {
    chain: query.data || undefined,
    ...query,
  };
};
