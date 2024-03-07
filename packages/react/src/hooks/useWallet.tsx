import { useQuery } from '@tanstack/react-query';
import { Address } from 'fuels';

import { useFuel } from '../providers';
import { QUERY_KEYS } from '../utils';

export const useWallet = (address?: string | null) => {
  const { fuel } = useFuel();

  return useQuery({
    queryKey: [QUERY_KEYS.wallet, address],
    queryFn: async () => {
      // Check if the address is valid
      await Address.fromString(address as string);
      const wallet = await fuel.getWallet(address as string);
      return wallet;
    },
    enabled: !!address,
  });
};
