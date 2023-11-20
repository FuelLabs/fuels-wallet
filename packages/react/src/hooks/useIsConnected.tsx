import { useQuery } from '@tanstack/react-query';

import { useFuel } from '../components';
import { QUERY_KEYS } from '../utils';

export const useIsConnected = () => {
  const { fuel } = useFuel();

  const { data, ...queryProps } = useQuery(
    [QUERY_KEYS.isConnected],
    async () => {
      // This ensure the hook returns false even if
      // no connector is selected.
      try {
        const isConnected = await fuel?.isConnected();
        return isConnected || false;
      } catch {
        return false;
      }
    },
    {
      enabled: !!fuel,
    }
  );

  return {
    isConnected: data,
    ...queryProps,
  };
};
