import { Box, Text } from '@fuel-ui/react';
import { useEffect, useState } from 'react';

import { ExampleBox } from '../src/components/ExampleBox';

export function FuelLoaded() {
  const [fuel, setFuel] = useState<Window['fuel']>();

  useEffect(() => {
    /* detectFuel:start */
    // Fuel loaded handler
    const onFuelLoaded = () => {
      setFuel(window.fuel);
    };

    // If fuel is already loaded, call the handler
    if (window.fuel) {
      onFuelLoaded();
    }

    // Listen for the fuelLoaded event
    document.addEventListener('FuelLoaded', onFuelLoaded);

    // On unmount, remove the event listener
    return () => {
      document.removeEventListener('FuelLoaded', onFuelLoaded);
    };
    /* detectFuel:end */
  }, []);

  return (
    <ExampleBox showNotDetectedOverlay={false}>
      <Box.Flex gap="$4">
        {fuel ? (
          <Text>
            <b>fuel</b> is ready to use
          </Text>
        ) : (
          <Text>
            <b>fuel</b> not detected
          </Text>
        )}
      </Box.Flex>
    </ExampleBox>
  );
}
