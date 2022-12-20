import type { TransactionRequest } from 'fuels';
import { useMemo } from 'react';

import { TxService } from '../services';

import { useAccounts } from '~/systems/Account';

export function useTxOutputs(tx: TransactionRequest | undefined) {
  const { account } = useAccounts();
  return useMemo(() => TxService.getOutputs({ tx, account }), [tx]);
}
