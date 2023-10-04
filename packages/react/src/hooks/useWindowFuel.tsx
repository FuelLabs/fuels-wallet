import { useEffect, useState } from 'react';

export function useWindowFuel() {
  const [fuel, setFuel] = useState<Window['fuel']>();

  useEffect(() => {
    const onFuelLoaded = () => {
      const connectorName = localStorage.getItem('connector');
      if (window.fuel && connectorName) {
        window.fuel.selectConnector(connectorName);
      }
      setFuel(window.fuel);
    };

    if (window.fuel) {
      onFuelLoaded();
    }

    document.addEventListener('FuelLoaded', onFuelLoaded);

    // On unmount remove the event listener
    return () => {
      document.removeEventListener('FuelLoaded', onFuelLoaded);
    };
  }, []);

  return fuel;
}
