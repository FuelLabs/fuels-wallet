import { useQuery } from '@tanstack/react-query';

import { useFuel } from '../providers';
import { QUERY_KEYS } from '../utils';

export const useIsConnected = () => {
  const { fuel } = useFuel();

  const { data, ...queryProps } = useQuery(
    [QUERY_KEYS.isConnected],
    async () => {
      try {
        const isConnected = await fuel.isConnected();
        return isConnected || false;
      } catch {
        return false;
      }
    },
    {
      initialData: null,
    }
  );

  return {
    isConnected: data,
    ...queryProps,
  };
};
