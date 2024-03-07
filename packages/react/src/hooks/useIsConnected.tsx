import { useQuery } from '@tanstack/react-query';

import { useFuel } from '../providers';
import { QUERY_KEYS } from '../utils';

export const useIsConnected = () => {
  const { fuel } = useFuel();

  return useQuery({
    queryKey: [QUERY_KEYS.isConnected],
    queryFn: fuel?.isConnected,
  });
};
