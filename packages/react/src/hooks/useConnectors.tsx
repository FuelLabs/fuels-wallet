import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '../utils';

import { useWindowFuel } from './useWindowFuel';

export const useConnectors = () => {
  const fuel = useWindowFuel();

  const query = useQuery(
    [QUERY_KEYS.chain, fuel],
    async () => {
      return fuel?.listConnectors();
    },
    {
      enabled: !!fuel,
    },
  );

  return {
    connectors: query.data || [],
    ...query,
  };
};
