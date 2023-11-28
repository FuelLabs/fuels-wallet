import { useQuery } from '@tanstack/react-query';
import { Address } from 'fuels';

import { useFuel } from '../providers';
import { QUERY_KEYS } from '../utils';

export const useWallet = (address?: string | null) => {
  const { fuel } = useFuel();

  const { data, ...queryProps } = useQuery(
    [QUERY_KEYS.wallet, address],
    async () => {
      try {
        const accountAddress = address || (await fuel.currentAccount()) || '';
        // Check if the address is valid
        await Address.fromString(accountAddress);
        const wallet = await fuel.getWallet(accountAddress);
        return wallet || null;
      } catch (error: unknown) {
        return null;
      }
    }
  );

  return {
    wallet: data,
    ...queryProps,
  };
};
