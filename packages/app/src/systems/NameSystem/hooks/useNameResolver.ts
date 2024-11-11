import { isB256 } from 'fuels';
import { useEffect, useState } from 'react';
import { useNameSystem } from './useNameSystem';

export const useNameResolver = (address: string) => {
  const nameSystem = useNameSystem();
  const [name, setName] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (nameSystem && isB256(address)) {
      const name = nameSystem.name(address);
      setName(name);
    }
  }, [nameSystem, address]);

  return name;
};
