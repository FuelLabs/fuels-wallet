import { useNamedQuery } from '../core';
import { useFuel } from '../providers';
import { QUERY_KEYS } from '../utils';

export const useAccounts = () => {
  const { fuel } = useFuel();

  return useNamedQuery('accounts', {
    queryKey: [QUERY_KEYS.accounts],
    queryFn: async () => {
      try {
        const accounts = await fuel.accounts();
        return accounts || [];
      } catch (error: unknown) {
        return [];
      }
    },
    initialData: [],
  });
};
