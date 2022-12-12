import type { TransactionRequest } from 'fuels';
import { useMemo } from 'react';

import { TxService } from '../services';

import { useAccounts } from '~/systems/Account';

export function useTxOutputs(tx: TransactionRequest | undefined) {
  const { selectedAccount } = useAccounts();
  return useMemo(
    () => TxService.getOutputs({ tx, account: selectedAccount }),
    [tx]
  );
}
