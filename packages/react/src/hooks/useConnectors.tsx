import { useQuery } from '@tanstack/react-query';

import { useFuel } from '../components';
import { QUERY_KEYS } from '../utils';

export const useConnectors = () => {
  const { fuel } = useFuel();

  const query = useQuery(
    [QUERY_KEYS.connectorList],
    async () => {
      return fuel?.listConnectors();
    },
    {
      enabled: !!fuel,
    }
  );

  return {
    connectors: query.data || [],
    ...query,
  };
};
