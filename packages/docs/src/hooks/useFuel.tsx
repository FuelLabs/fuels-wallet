import { Fuel } from '@fuel-wallet/sdk';
import { useState, useEffect } from 'react';

const fuelSDK = new Fuel();

export function useFuel() {
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
