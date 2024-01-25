import { useQuery } from '@tanstack/react-query';

import { useFuel } from '../providers';
import { QUERY_KEYS } from '../utils';

export const useConnectors = () => {
  const { fuel } = useFuel();

  const query = useQuery(
    [QUERY_KEYS.connectorList],
    async () => {
      return fuel.connectors();
    },
    {
      initialData: [],
    }
  );

  return {
    connectors: query.data,
    ...query,
  };
};
