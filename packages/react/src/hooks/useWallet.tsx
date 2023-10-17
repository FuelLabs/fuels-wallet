import { useQuery } from '@tanstack/react-query';

import { useFuel } from '../components';
import { QUERY_KEYS } from '../utils';

export const useWallet = ({ address }: { address?: string }) => {
  const { fuel } = useFuel();

  const { data, ...queryProps } = useQuery(
    [QUERY_KEYS.wallet, address],
    async () => {
      try {
        const wallet = await fuel?.getWallet(address || '');
        return wallet || null;
      } catch (error: unknown) {
        return null;
      }
    },
    {
      enabled: !!fuel && !!address,
    },
  );

  return {
    wallet: data || undefined,
    ...queryProps,
  };
};
