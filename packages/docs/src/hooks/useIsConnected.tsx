import { useEffect, useState } from 'react';

import { useFuelWeb3 } from './useFuelWeb3';

export function useIsConnected() {
  const [FuelWeb3] = useFuelWeb3();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    async function main() {
      try {
        const accounts = await FuelWeb3.accounts();
        setIsConnected(Boolean(accounts.length));
      } catch (err) {
        setIsConnected(false);
      }
    }

    if (FuelWeb3) {
      main();
    }

    FuelWeb3?.on('connection', main);
    return () => {
      FuelWeb3?.off('connection', main);
    };
  }, [FuelWeb3]);

  return [isConnected];
}
