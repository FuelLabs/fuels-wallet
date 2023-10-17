import { useQuery } from '@tanstack/react-query';

import { useFuel } from '../components';
import { QUERY_KEYS } from '../utils';

export const useProvider = () => {
  const { fuel } = useFuel();

  const { data, ...queryProps } = useQuery(
    [QUERY_KEYS.provider],
    async () => {
      const provider = await fuel?.getProvider();
      return provider || null;
    },
    {
      enabled: !!fuel,
    },
  );

  return {
    provider: data || undefined,
    ...queryProps,
  };
};
