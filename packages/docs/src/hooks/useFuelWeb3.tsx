// This is not need if the developer

import { useState, useEffect } from 'react';

const globalWindow = typeof window !== 'undefined' ? window : ({} as Window);
export type FuelWeb3 = typeof globalWindow.FuelWeb3;

// install FuelWeb3 and import as a package
export function useFuelWeb3() {
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [fuelWeb3, setFuelWeb3] = useState<Window['FuelWeb3']>(
    globalWindow.FuelWeb3
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (globalWindow.FuelWeb3) {
        setFuelWeb3(globalWindow.FuelWeb3);
      } else {
        setError('FuelWeb3 not detected on the window!');
      }
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  return [fuelWeb3, error, isLoading] as const;
}
