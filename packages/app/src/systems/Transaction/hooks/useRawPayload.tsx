import { hexlify, TransactionCoder, type Transaction } from 'fuels';
import { useMemo } from 'react';

type RawPayloadProps = {
  transaction?: Transaction;
};

export function useRawPayload(props: Partial<RawPayloadProps>) {
  const { transaction } = props;
  const rawPayload = useMemo(() => {
    if (transaction) {
      try {
        const raw = hexlify(new TransactionCoder().encode(transaction));

        return raw;
        // eslint-disable-next-line no-empty
      } catch (_) {}
    }

    return undefined;
  }, [JSON.stringify(transaction || {})]);
  return { rawPayload };
}
