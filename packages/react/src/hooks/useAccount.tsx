import { useQuery } from '@tanstack/react-query';

import { useFuel } from '../providers';
import { QUERY_KEYS } from '../utils';

export const useAccount = () => {
  const { fuel } = useFuel();

  const { data, ...queryProps } = useQuery(
    [QUERY_KEYS.account],
    async () => {
      try {
        const currentFuelAccount = await fuel?.currentAccount();
        return currentFuelAccount || null;
      } catch (error: unknown) {
        return null;
      }
    },
    {
      initialData: null,
    }
  );

  return {
    account: data,
    ...queryProps,
  };
};
