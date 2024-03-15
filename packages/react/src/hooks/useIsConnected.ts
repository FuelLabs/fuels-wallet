import { useNamedQuery } from '../core';
import { useFuel } from '../providers';
import { QUERY_KEYS } from '../utils';

export const useIsConnected = () => {
  const { fuel } = useFuel();

  const query = useNamedQuery('isConnected', {
    queryKey: [QUERY_KEYS.isConnected],
    queryFn: async () => {
      try {
        const isConnected = await fuel.isConnected();
        return isConnected || false;
      } catch {
        return false;
      }
    },
    initialData: null,
  });

  return query;
};
