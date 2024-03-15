import { useNamedQuery } from '../core';
import { useFuel } from '../providers';
import { QUERY_KEYS } from '../utils';

export const useNetwork = () => {
  const { fuel } = useFuel();

  return useNamedQuery('network', {
    queryKey: [QUERY_KEYS.currentNetwork],
    queryFn: async () => {
      return fuel.currentNetwork();
    },
  });
};
