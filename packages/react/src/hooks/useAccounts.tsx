import { useQuery } from '@tanstack/react-query';

import { useFuel } from '../components';
import { QUERY_KEYS } from '../utils';

export const useAccounts = () => {
  const { fuel } = useFuel();

  const { data, ...queryProps } = useQuery(
    [QUERY_KEYS.accounts],
    async () => {
      try {
        const accounts = await fuel?.accounts();
        return accounts || null;
      } catch (error: unknown) {
        return null;
      }
    },
    {
      enabled: !!fuel,
    }
  );

  return {
    accounts: data || undefined,
    ...queryProps,
  };
};
