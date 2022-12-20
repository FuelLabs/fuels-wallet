import { useMemo } from 'react';

import type { ParseTxParams } from '../utils';
import { parseTx } from '../utils';

export function useParseTx(props: Partial<ParseTxParams>) {
  const { transaction, receipts, gasPerByte, gasPriceFactor, gqlStatus, id } =
    props;

  const tx = useMemo(() => {
    if (!transaction || !receipts || !gasPerByte || !gasPriceFactor)
      return undefined;

    return parseTx({
      transaction,
      receipts,
      gasPerByte,
      gasPriceFactor,
      gqlStatus,
      id,
    });
  }, [transaction, receipts, gasPerByte, gasPriceFactor, gqlStatus, id]);

  return tx;
}
