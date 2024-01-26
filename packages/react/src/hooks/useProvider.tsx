import { useQuery } from '@tanstack/react-query';

import { useFuel } from '../providers';
import { QUERY_KEYS } from '../utils';

export const useProvider = () => {
  const { fuel } = useFuel();

  const { data, ...queryProps } = useQuery(
    [QUERY_KEYS.provider],
    async () => {
      const provider = await fuel.getProvider();
      return provider || null;
    },
    {
      initialData: null,
    }
  );

  return {
    provider: data,
    ...queryProps,
  };
};
