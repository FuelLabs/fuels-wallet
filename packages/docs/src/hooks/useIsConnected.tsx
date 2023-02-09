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

    fuel?.on(fuel.events.connection, main);
    return () => {
      fuel?.off(fuel.events.connection, main);
    };
  }, [fuel]);

  return [isConnected];
}
