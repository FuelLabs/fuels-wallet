import type { Operation } from 'fuels';
import { useMemo } from 'react';
import { groupSimilarOperations } from '../utils/simplifyTransaction';

export function useSimplifyTransaction(operations: Operation[]) {
  const simplifiedOperations = useMemo(() => {
    return groupSimilarOperations(operations);
  }, [operations]);

  return { simplifiedOperations };
}
