import { Address } from 'fuels';

import { useNamedQuery } from '../core';
import { useFuel } from '../providers';
import { QUERY_KEYS } from '../utils';

export const useWallet = (address?: string | null) => {
  const { fuel } = useFuel();

  return useNamedQuery('wallet', {
    queryKey: [QUERY_KEYS.wallet, address],
    queryFn: async () => {
      try {
        const accountAddress = address || (await fuel.currentAccount()) || '';
        // Check if the address is valid
        await Address.fromString(accountAddress);
        const wallet = await fuel.getWallet(accountAddress);
        return wallet || null;
      } catch (error: unknown) {
        return null;
      }
    },
  });
};
