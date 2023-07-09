import { useMemo } from 'react';

import type { ParseTxParams } from '../utils';
import { parseTx } from '../utils';

import { useContractIds } from './useContractIds';
import { useRawPayload } from './useRawPayload';

import { useAbiMap } from '~/systems/Settings/hooks';

export function useParseTx(props: Partial<ParseTxParams>) {
  const { transaction, receipts, gasPerByte, gasPriceFactor, gqlStatus, id } =
    props;

  const { contractIds } = useContractIds({ inputs: transaction?.inputs });
  const { abiMap } = useAbiMap({ contractIds });
  const { rawPayload } = useRawPayload({ transaction });

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
      rawPayload,
    });
  }, Object.values(props));

  return tx;
}
