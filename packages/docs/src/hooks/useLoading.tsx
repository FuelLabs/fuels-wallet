/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';

import { useFuelWeb3 } from './useFuelWeb3';

export function useLoading<T extends (...args: any) => Promise<void>>(
  callback: T,
  deps: any = []
) {
  const [FuelWeb3] = useFuelWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const execute = useCallback(
    async (...args: any) => {
      setError(null);
      setLoading(true);
      callback(...args)
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [FuelWeb3, ...deps]
  );

  return [execute as T, loading, error] as const;
}
