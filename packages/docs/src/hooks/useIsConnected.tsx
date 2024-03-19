import { useEffect, useState } from 'react';

import { useFuel } from './useFuel';

export function useIsConnected() {
  const [fuel, error, isLoading] = useFuel();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    async function handleConnection() {
      if (error || isLoading) return;
      const isConnected = await fuel.isConnected();
      setIsConnected(isConnected);
    }

    if (fuel) {
      handleConnection();
    }

    /* eventConnection:start */
    fuel?.on(fuel.events.connection, handleConnection);

    return () => {
      fuel?.off(fuel.events.connection, handleConnection);
    };
    /* eventConnection:end */
  }, [fuel, isLoading, error]);

  return [isConnected];
}
