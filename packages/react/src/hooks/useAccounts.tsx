import { useQuery } from '@tanstack/react-query';

import { useFuel } from '../providers';
import { QUERY_KEYS } from '../utils';

export const useAccounts = () => {
  const { fuel } = useFuel();

  const { data, ...queryProps } = useQuery(
    [QUERY_KEYS.accounts],
    async () => {
      try {
        const accounts = await fuel.accounts();
        return accounts || [];
      } catch (error: unknown) {
        return [];
      }
    },
    {
      initialData: [],
    }
  );

  return {
    accounts: data,
    ...queryProps,
  };
};
