import { TransactionCoder, hexlify } from 'fuels';
import { useMemo } from 'react';

import type { ParseTxParams } from '../utils';
import { getInputsContract, parseTx } from '../utils';

import { useAbiMap } from '~/systems/Settings/hooks';

export function useParseTx(props: Partial<ParseTxParams>) {
  const { transaction, receipts, gasPerByte, gasPriceFactor, gqlStatus, id } =
    props;

  const contractIds = useMemo(() => {
    if (!transaction?.inputs) return undefined;

    return getInputsContract(transaction.inputs).map(
      (input) => input.contractID
    );
  }, [transaction?.inputs]);

  const { abiMap } = useAbiMap({ contractIds });

  const rawPayload = useMemo(() => {
    if (transaction) {
      try {
        const raw = hexlify(new TransactionCoder().encode(transaction));

        return raw;
        // eslint-disable-next-line no-empty
      } catch (_) {}
    }

    return undefined;
  }, [transaction]);

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
