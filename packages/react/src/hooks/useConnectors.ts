import { useNamedQuery } from '../core';
import { useFuel } from '../providers';
import { QUERY_KEYS } from '../utils';

export const useConnectors = () => {
  const { fuel } = useFuel();

  return useNamedQuery('connectors', {
    queryKey: [QUERY_KEYS.connectorList],
    queryFn: async () => {
      return fuel.connectors();
    },
    initialData: [],
  });
};
