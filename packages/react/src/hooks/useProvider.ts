import { useNamedQuery } from '../core';
import { useFuel } from '../providers';
import { QUERY_KEYS } from '../utils';

export const useProvider = () => {
  const { fuel } = useFuel();

  return useNamedQuery('provider', {
    queryKey: [QUERY_KEYS.provider],
    queryFn: async () => {
      const provider = await fuel.getProvider();
      return provider || null;
    },
    initialData: null,
  });
};
