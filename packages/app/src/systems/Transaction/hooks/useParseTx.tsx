import { useMemo } from 'react';

import type { ParseTxParams } from '../utils';
import { parseTx } from '../utils';

import { useAbiMap } from '~/systems/Settings/hooks';

export function useParseTx(props: Partial<ParseTxParams>) {
  const { transaction, receipts, gasPerByte, gasPriceFactor, gqlStatus, id } =
    props;
  const { abiMap } = useAbiMap();

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
      abiMap,
    });
  }, Object.values(props));

  return tx;
}
