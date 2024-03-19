import { type Transaction, TransactionCoder, hexlify } from 'fuels';
import { useMemo } from 'react';

type RawPayloadProps = {
  transaction?: Transaction;
};

export function useRawPayload(props: Partial<RawPayloadProps>) {
  const { transaction } = props;
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const rawPayload = useMemo(() => {
    if (transaction) {
      try {
        const raw = hexlify(new TransactionCoder().encode(transaction));

        return raw;
      } catch (_) {}
    }

    return undefined;
  }, [JSON.stringify(transaction || {})]);
  return { rawPayload };
}
