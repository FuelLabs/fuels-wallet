import type { JsonAbi } from 'fuels';
import { useEffect, useState } from 'react';

import { AbiService } from '../services';

export function useAbiMap({ contractIds }: { contractIds?: string[] }) {
  const [abiMap, setAbiMap] = useState<Record<string, JsonAbi> | undefined>(
    undefined
  );

  useEffect(() => {
    async function getAbiMap() {
      if (contractIds) {
        const abis = await Promise.all(
          contractIds.map((contractId) =>
            AbiService.getAbi({ data: contractId })
          )
        );
        const newAbiMap = abis.reduce((prev, abi, index) => {
          if (abi) {
            // eslint-disable-next-line no-param-reassign
            prev[contractIds[index]] = abi;
          }

          return prev;
        }, {} as Record<string, JsonAbi>);
        setAbiMap(newAbiMap);
      }
    }

    getAbiMap();
  }, [contractIds]);

  return {
    abiMap,
  };
}
