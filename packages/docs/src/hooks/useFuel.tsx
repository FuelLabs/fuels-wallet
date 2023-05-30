import { Fuel } from '@fuel-wallet/sdk';
import { useState, useEffect } from 'react';

export function useFuel() {
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [fuel] = useState<Fuel>(new Fuel());

  useEffect(() => {
    const detectInjectedFuel = async () => {
      try {
        await fuel.isConnected();
        setError('');
      } catch (e) {
        setError((e as Error).message); // 'fuel not detected on the window!'
      }
      setLoading(false);
    };
    detectInjectedFuel();
  }, []);

  return [fuel as Fuel, error, isLoading] as const;
}
