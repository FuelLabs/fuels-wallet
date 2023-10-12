import { useQuery } from '@tanstack/react-query';

import { useFuel } from '../components';
import { QUERY_KEYS } from '../utils';

export const useIsConnected = () => {
  const { fuel } = useFuel();

  const { data, ...queryProps } = useQuery(
    [QUERY_KEYS.isConnected],
    async () => {
      const isConnected = await fuel?.isConnected();
      return isConnected || false;
    },
    {
      enabled: !!fuel,
    },
  );

  return {
    isConnected: data,
    ...queryProps,
  };
};
