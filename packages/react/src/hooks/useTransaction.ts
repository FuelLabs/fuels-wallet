// TODO: fix this import when sdk error gets fixed: https://github.com/FuelLabs/fuels-ts/issues/1054
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type * as fuels from 'fuels';

import { useNamedQuery } from '../core';
import { useFuel } from '../providers';
import { QUERY_KEYS } from '../utils';

export const useTransaction = (txId?: string) => {
  const { fuel } = useFuel();

  return useNamedQuery('transaction', {
    queryKey: [QUERY_KEYS.transaction, txId],
    queryFn: async () => {
      try {
        const provider = await fuel?.getProvider();
        if (!provider) return null;
        const response = await provider.getTransaction(txId || '');
        return response;
      } catch (error: unknown) {
        return null;
      }
    },
    initialData: null,
    enabled: !!txId,
  });
};
