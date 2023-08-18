import { arrayify, assembleTransactionSummary, bn } from 'fuels';
import { useMemo } from 'react';

import type { ParseTxParams } from '../utils';

import { useContractIds } from './useContractIds';
import { useRawPayload } from './useRawPayload';

import { useAbiMap } from '~/systems/Settings/hooks';

export function useParseTx(props: Partial<ParseTxParams>) {
  const { transaction, receipts, gasPerByte, gasPriceFactor, id } = props;

  const { contractIds } = useContractIds({ inputs: transaction?.inputs });
  const { abiMap } = useAbiMap({ contractIds });
  const { rawPayload } = useRawPayload({ transaction });

  const tx = useMemo(() => {
    if (!transaction || !receipts || !gasPerByte || !gasPriceFactor)
      return undefined;

    const txSummary = assembleTransactionSummary({
      id,
      transaction,
      gasPrice: bn(transaction.gasPrice),
      transactionBytes: arrayify(rawPayload || ''),
      receipts,
      abiParam: abiMap,
    });

    return txSummary;
  }, Object.values(props));

  return tx;
}
