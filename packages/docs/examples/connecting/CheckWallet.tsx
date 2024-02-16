/* eslint-disable no-console */
import { Box, Text } from '@fuel-ui/react';
import type { FuelConnector } from '@fuel-wallet/sdk';
import { useFuel } from '@fuels/react';
import { useEffect, useState } from 'react';

import { ExampleBox } from '../../src/components/ExampleBox';

export function CheckWallet() {
  const { fuel } = useFuel();
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function handleConnector() {
      /* checkWallet:start */
      const hasConnector = await fuel.hasConnector();
      console.log('hasConnector', hasConnector);
      /* checkWallet:end */
      setMessage(
        hasConnector ? `Wallet found!` : 'Wallet not detected on the browser'
      );
    }

    handleConnector();

    /* watchWallet:start */
    function logConnector(currentConnector: FuelConnector) {
      console.log('currentConnector', currentConnector);
      handleConnector(); // ignore-line
    }
    fuel.on(fuel.events.currentConnector, logConnector);
    /* watchWallet:end */
    return () => {
      fuel.off(fuel.events.currentConnector, logConnector);
    };
  }, []);

  return (
    <ExampleBox showNotDetectedOverlay={false}>
      <Box.Flex gap="$4" align={'center'}>
        <Text as="span" color={'scalesGreen8'}>
          {message}
        </Text>
      </Box.Flex>
    </ExampleBox>
  );
}
