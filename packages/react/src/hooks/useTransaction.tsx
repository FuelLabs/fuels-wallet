import { useQuery } from '@tanstack/react-query';
// TODO: fix this import when sdk error gets fixed: https://github.com/FuelLabs/fuels-ts/issues/1054
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type * as fuels from 'fuels';

import { useFuel } from '../components';

export const useTransaction = (txId?: string) => {
  const { fuel } = useFuel();

  const { data, ...query } = useQuery(
    ['transaction', txId],
    async () => {
      try {
        const provider = await fuel?.getProvider();
        if (!provider) return null;
        const response = await provider.getTransaction(txId || '');
        return response;
      } catch (error: unknown) {
        return null;
      }
    },
    {
      enabled: !!fuel && !!txId,
    },
  );

  return {
    transaction: data || undefined,
    ...query,
  };
};
