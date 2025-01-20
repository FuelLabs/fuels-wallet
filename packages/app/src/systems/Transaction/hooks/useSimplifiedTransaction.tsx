import type { TransactionRequest, TransactionSummary } from 'fuels';
import { useMemo } from 'react';
import { useAccounts } from '~/systems/Account';
import type { SimplifiedTransaction } from '../types';
import { simplifyTransaction } from '../utils/simplifyTransaction';

type UseSimplifiedTransactionProps = {
  summary?: TransactionSummary;
  request?: TransactionRequest;
};

export function useSimplifiedTransaction({
  summary,
  request,
}: UseSimplifiedTransactionProps) {
  const { account } = useAccounts();

  const transaction = useMemo<SimplifiedTransaction | undefined>(() => {
    if (!summary) return undefined;

    return simplifyTransaction(summary, request, account?.address);
  }, [summary, request, account?.address]);

  return {
    transaction,
    isReady: !!transaction,
  };
}
