import { useCallback, useState } from 'react';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function useLoading<T extends (...args: any) => Promise<void>>(
  callback: T,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  deps: any = []
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();

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
    [callback, ...deps]
  );

  return [execute as T, loading, error] as const;
}
