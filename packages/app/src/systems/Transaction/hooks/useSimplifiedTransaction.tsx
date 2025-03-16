import type { TransactionRequest, TransactionSummary } from 'fuels';
import { useMemo } from 'react';
import { useAccounts } from '~/systems/Account';
import { simplifyTransaction } from '../services/transformers/simplifyTransaction';
import type { SimplifiedTransaction } from '../types';

type UseSimplifiedTransactionProps = {
  tx: TransactionSummary;
  txRequest?: TransactionRequest;
};

export function useSimplifiedTransaction({
  tx,
  txRequest,
}: UseSimplifiedTransactionProps) {
  const { account } = useAccounts();

  const transaction = useMemo<SimplifiedTransaction>(() => {
    return simplifyTransaction(tx, txRequest, account?.address);
  }, [tx, txRequest, account?.address]);

  return {
    transaction,
    isReady: !!transaction,
  };
}
