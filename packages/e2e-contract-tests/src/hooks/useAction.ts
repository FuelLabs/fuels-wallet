import { useCallback, useState } from 'react';

type UseActionParams = {
  isValid: boolean;
  action: () => Promise<void>;
};

export const useAction = ({ isValid, action }: UseActionParams) => {
  const [error, setError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const execute = useCallback(async () => {
    if (!isValid) return;
    setIsExecuting(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(
        (err as Error | undefined)?.message || 'An unexpected error occurred.'
      );
    } finally {
      setIsExecuting(false);
    }
  }, [isValid, action]);

  return {
    disabled: !isValid || isExecuting,
    execute,
    error,
  };
};
