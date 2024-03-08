import { TransactionResponse } from 'fuels';
// should import BN because of this TS error: https://github.com/microsoft/TypeScript/issues/47663
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TransactionResultReceipt } from 'fuels';

import { useNamedQuery } from '../core';
import { useFuel } from '../providers';
import { QUERY_KEYS } from '../utils';

export const useTransactionReceipts = ({ txId }: { txId?: string }) => {
  const { fuel } = useFuel();

  return useNamedQuery('transactionReceipts', {
    queryKey: [QUERY_KEYS.transactionReceipts, txId],
    queryFn: async () => {
      try {
        const provider = await fuel.getProvider();
        if (!provider) return null;

        const response = new TransactionResponse(txId || '', provider);
        if (!response) return null;

        const { receipts } = await response.waitForResult();
        return receipts || null;
      } catch (error: unknown) {
        return null;
      }
    },
    initialData: null,
    enabled: !!txId,
  });
};
