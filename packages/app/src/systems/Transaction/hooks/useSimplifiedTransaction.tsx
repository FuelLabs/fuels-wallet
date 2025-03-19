import type { TransactionRequest, TransactionSummary } from 'fuels';
import { useMemo } from 'react';
import { useAccounts } from '~/systems/Account';
import { simplifyTransaction } from '../services/transformers/simplifyTransaction';
import type { SimplifiedTransaction } from '../types';

type UseSimplifiedTransactionProps = {
  tx: TransactionSummary;
  txRequest?: TransactionRequest;
  txAccount?: string;
};

export function useSimplifiedTransaction({
  tx,
  txRequest,
  txAccount,
}: UseSimplifiedTransactionProps) {
  const transaction = useMemo<SimplifiedTransaction>(() => {
    return simplifyTransaction(tx, txRequest, txAccount);
  }, [tx, txRequest, txAccount]);

  return {
    transaction,
    isReady: !!transaction,
  };
}
