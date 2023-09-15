import { useQuery } from '@tanstack/react-query';
import { TransactionResponse } from 'fuels';
// should import BN because of this TS error: https://github.com/microsoft/TypeScript/issues/47663
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TransactionResultReceipt } from 'fuels';

import { useFuel } from '../components';
import { QUERY_KEYS } from '../utils';

export const useTransactionReceipts = ({ txId }: { txId?: string }) => {
  const { fuel } = useFuel();

  const { data, ...queryProps } = useQuery(
    [QUERY_KEYS.transactionReceipts, txId],
    async () => {
      try {
        const provider = await fuel?.getProvider();
        if (!provider) return null;

        const response = new TransactionResponse(txId || '', provider);
        if (!response) return null;

        const { receipts } = await response.waitForResult();
        return receipts || null;
      } catch (error: unknown) {
        return null;
      }
    },
    {
      enabled: !!fuel && !!txId,
    }
  );

  return {
    transactionReceipts: data || undefined,
    ...queryProps,
  };
};
