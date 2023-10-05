import { Fuel } from '@fuel-wallet/sdk';
import { useState, useEffect, useMemo } from 'react';

export function useFuel() {
  const fuelSDK = useMemo(() => new Fuel(), []);
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fuelSDK
      .hasWallet()
      .then((hasWallet) => {
        setError(hasWallet ? '' : 'fuel not detected on the window!');
        setLoading(false);
      })
      .catch(() => {});

    const handleFuelLoad = () => {
      setLoading(false);
      setError('');
    };

    fuelSDK.on(fuelSDK.events.load, handleFuelLoad);
    return () => {
      fuelSDK.on(fuelSDK.events.load, handleFuelLoad);
    };
  }, []);

  return [fuelSDK, error, isLoading] as const;
}
