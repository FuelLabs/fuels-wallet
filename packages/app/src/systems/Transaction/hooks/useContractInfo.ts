import { useEffect, useState } from 'react';
import { getContractInfo } from '../utils/getContractInfo';
import type { ContractInfo } from '../utils/getContractInfo';

export function useContractInfo(contractId?: string) {
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchContractInfo() {
      if (!contractId) return;

      setIsLoading(true);
      try {
        const info = await getContractInfo(contractId);
        setContractInfo(info);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching contract info:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContractInfo();
  }, [contractId]);

  return { contractInfo, isLoading, error };
}
