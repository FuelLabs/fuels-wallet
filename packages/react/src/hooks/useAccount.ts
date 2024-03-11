import { useNamedQuery } from '../core';
import { useFuel } from '../providers';
import { QUERY_KEYS } from '../utils';

export const useAccount = () => {
  const { fuel } = useFuel();

  return useNamedQuery('account', {
    queryKey: [QUERY_KEYS.account],
    queryFn: async () => {
      try {
        const currentFuelAccount = await fuel?.currentAccount();
        return currentFuelAccount || null;
      } catch (error: unknown) {
        return null;
      }
    },
    initialData: null,
  });
};
