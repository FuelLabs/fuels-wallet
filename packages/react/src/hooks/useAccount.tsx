import type { UseQueryOptions} from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { useFuel } from '../providers';
import { QUERY_KEYS } from '../utils';

export const useAccount = (options?: UseQueryOptions<string | null>) => {
  const { fuel } = useFuel();

  return useQuery({
    queryKey: [QUERY_KEYS.account],
    queryFn: fuel?.currentAccount,
    ...options,
  });
};
