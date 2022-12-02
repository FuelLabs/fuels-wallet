import type { TransactionRequest } from 'fuels';
import { useMemo } from 'react';

import { TxService } from '../services';

import { useAccount } from '~/systems/Account';

export function useTxOutputs(tx: TransactionRequest | undefined) {
  const { account } = useAccount();
  return useMemo(() => TxService.getOutputs({ tx, account }), [tx]);
}
