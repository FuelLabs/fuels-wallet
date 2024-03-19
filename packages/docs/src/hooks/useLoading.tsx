import { useCallback, useState } from 'react';

import { useFuel } from './useFuel';
import { useIsConnected } from './useIsConnected';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function useLoading<T extends (...args: any) => Promise<void>>(
  callback: T,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  deps: any = []
) {
  const [fuel] = useFuel();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const [isConnected] = useIsConnected();
  const execute = useCallback(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
    [fuel, isConnected, ...deps]
  );

  return [execute as T, loading, error] as const;
}
