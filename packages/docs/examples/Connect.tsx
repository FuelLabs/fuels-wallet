/* eslint-disable no-console */
import { Box, Button } from '@fuel-ui/react';
import { useState } from 'react';

import { ExampleBox } from '../src/components/ExampleBox';
import { useFuel } from '../src/hooks/useFuel';
import { useLoading } from '../src/hooks/useLoading';

export function Connect() {
  const [fuel, notDetected] = useFuel();
  const [connected, setConnected] = useState(false);

  const [handleConnect, isConnecting, errorConnect] = useLoading(async () => {
    console.log('Request connection to Wallet!');
    /* connect:start */
    const isConnected = await fuel.connect();
    console.log('Connection response', isConnected);
    /* connect:end */
    setConnected(isConnected);
  });

  const [handleDisconnect, isDisconnecting, errorDisconnect] = useLoading(
    async () => {
      console.log('Request disconnection to Wallet!');
      /* disconnect:start */
      await fuel.disconnect();
      /* disconnect:end */
      setConnected(false);
      console.log('Disconnection response');
    }
  );

  const errorMessage = errorConnect || errorDisconnect || notDetected;

  return (
    <ExampleBox error={errorMessage}>
      <Box.Flex gap="$4">
        <Button
          onPress={handleConnect}
          isLoading={isConnecting}
          isDisabled={isConnecting || !fuel}
        >
          Connect
        </Button>
        <Button
          onPress={handleDisconnect}
          isLoading={isDisconnecting}
          isDisabled={isDisconnecting || !connected || !fuel}
        >
          {connected ? 'Disconnect' : 'Disconnected'}
        </Button>
      </Box.Flex>
    </ExampleBox>
  );
}
