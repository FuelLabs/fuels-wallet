import { FuelWalletEvents } from '@fuel-wallet/sdk';
import { useEffect, useState } from 'react';

import { useFuel } from './useFuel';

export function useIsConnected() {
  const [fuel] = useFuel();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    async function main() {
      try {
        const accounts = await fuel.accounts();
        setIsConnected(Boolean(accounts.length));
      } catch (err) {
        setIsConnected(false);
      }
    }

    if (fuel) {
      main();
    }

    fuel?.on(FuelWalletEvents.CONNECTION, main);
    return () => {
      fuel?.off(FuelWalletEvents.CONNECTION, main);
    };
  }, [fuel]);

  return [isConnected];
}
