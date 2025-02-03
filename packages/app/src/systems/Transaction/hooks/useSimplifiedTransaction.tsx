import type { TransactionRequest, TransactionSummary } from 'fuels';
import { useMemo } from 'react';
import { useAccounts } from '~/systems/Account';
import type { SimplifiedTransaction } from '../types';
import { simplifyTransaction } from '../utils/simplifyTransaction';

type UseSimplifiedTransactionProps = {
  tx?: TransactionSummary;
  txRequest?: TransactionRequest;
};

export function useSimplifiedTransaction({
  tx,
  txRequest,
}: UseSimplifiedTransactionProps) {
  const { account } = useAccounts();

  const transaction = useMemo<SimplifiedTransaction | undefined>(() => {
    if (!tx) return undefined;

    return simplifyTransaction(tx, txRequest, account?.address);
  }, [tx, txRequest, account?.address]);

  return {
    transaction,
    isReady: !!transaction,
  };
}
