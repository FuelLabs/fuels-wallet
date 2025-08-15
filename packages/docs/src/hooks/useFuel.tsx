import {
  FuelWalletConnector,
  FuelWalletDevelopmentConnector,
} from '@fuels/connectors';
import { Fuel } from 'fuels';
import { useEffect, useState } from 'react';

export function useFuel() {
  const [fuelSDK, setFuelSDK] = useState<Fuel | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // Only create Fuel instance on the client side
    if (typeof window === 'undefined') return;

    const fuel = new Fuel({
      connectors: [
        new FuelWalletConnector(),
        new FuelWalletDevelopmentConnector(),
      ],
    });

    setFuelSDK(fuel);

    fuel
      .hasConnector()
      .then((hasWallet) => {
        setError(hasWallet ? '' : 'fuel not detected on the window!');
        setLoading(false);
      })
      .catch(() => {
        setError('fuel not detected on the window!');
        setLoading(false);
      });

    const handleFuelLoad = () => {
      setLoading(false);
      setError('');
    };

    fuel.on(fuel.events.currentConnector, handleFuelLoad);
    return () => {
      fuel.on(fuel.events.currentConnector, handleFuelLoad);
    };
  }, []);

  return [fuelSDK, error, isLoading] as const;
}
