import { useQuery } from '@tanstack/react-query';
// should import BN because of this error: https://github.com/FuelLabs/fuels-ts/issues/1054
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { BytesLike, BN } from 'fuels';
import { Address } from 'fuels';
import { useEffect } from 'react';

import { QUERY_KEYS } from '../utils';

import { useProvider } from './useProvider';

export const useBalance = ({
  address,
  assetId,
}: {
  address?: string;
  assetId?: BytesLike;
}) => {
  const { provider } = useProvider();

  const query = useQuery(
    [QUERY_KEYS.balance, address, assetId],
    async () => {
      try {
        // TODO: replace with ETH_ASSET_ID from asset-list package after this task gets done
        // https://linear.app/fuel-network/issue/FRO-144/make-asset-list-package-public-and-publish-in-npm
        const currentFuelBalance = await provider?.getBalance(
          Address.fromString(address || ''),
          assetId ||
            '0x0000000000000000000000000000000000000000000000000000000000000000'
        );
        return currentFuelBalance || null;
      } catch (error: unknown) {
        return null;
      }
    },
    {
      enabled: !!provider,
    }
  );

  const listenerAccountFetcher = () => {
    query.refetch();
  };

  useEffect(() => {
    window.addEventListener('focus', listenerAccountFetcher);
    return () => {
      window.removeEventListener('focus', listenerAccountFetcher);
    };
  }, []);

  return {
    balance: query.data || undefined,
    ...query,
  };
};
