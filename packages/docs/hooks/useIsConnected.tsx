/* eslint-disable no-inner-declarations */
import { useEffect, useState } from 'react';

import { useFuelWeb3 } from './useFuelWeb3';

export function useIsConnected() {
  const [FuelWeb3] = useFuelWeb3();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (FuelWeb3) {
      async function main() {
        const accounts = await FuelWeb3.accounts();
        setIsConnected(Boolean(accounts.length));
      }
      main();
    }
  }, [FuelWeb3]);

  return [isConnected];
}
