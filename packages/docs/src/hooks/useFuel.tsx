import { Fuel } from '@fuel-wallet/sdk';
import { useState, useEffect } from 'react';

export function useFuel() {
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [fuel] = useState<Fuel>(new Fuel({ name: 'Fuel Wallet' }));

  useEffect(() => {
    fuel.hasWallet().then((hasWallet) => {
      setError(hasWallet ? '' : 'fuel not detected on the window!');
      setLoading(false);
    });
  }, []);

  return [fuel as Fuel, error, isLoading] as const;
}
