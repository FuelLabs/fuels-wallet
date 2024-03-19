import {
  FuelWalletConnector,
  FuelWalletDevelopmentConnector,
} from '@fuels/connectors';
import { Fuel } from 'fuels';
import { useEffect, useState } from 'react';

const fuelSDK = new Fuel({
  connectors: [new FuelWalletConnector(), new FuelWalletDevelopmentConnector()],
});

export function useFuel() {
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fuelSDK
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

    fuelSDK.on(fuelSDK.events.currentConnector, handleFuelLoad);
    return () => {
      fuelSDK.on(fuelSDK.events.currentConnector, handleFuelLoad);
    };
  }, []);

  return [fuelSDK, error, isLoading] as const;
}
