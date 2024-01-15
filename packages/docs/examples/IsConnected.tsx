/* eslint-disable no-console */
import { Box, Button, Text } from '@fuel-ui/react';
import { useState } from 'react';

import { ExampleBox } from '../src/components/ExampleBox';
import { useFuel } from '../src/hooks/useFuel';
import { useLoading } from '../src/hooks/useLoading';

export function IsConnected() {
  const [fuel, notDetected] = useFuel();
  const [connected, setConnected] = useState(false);

  const [handleIsConnected, isCheckingConnection, error] = useLoading(
    async () => {
      /* example:start */
      const isConnected = await fuel.isConnected();
      console.log('Connection response', isConnected);
      /* example:end */
      setConnected(isConnected);
    }
  );

  const errorMessage = error || notDetected;

  return (
    <ExampleBox error={errorMessage}>
      <Box.Flex gap="$4">
        <Button onClick={handleIsConnected} isLoading={isCheckingConnection}>
          Check Connection
        </Button>
        <Text>
          {connected
            ? 'Your wallet is connected'
            : 'Your wallet is disconnected'}
        </Text>
      </Box.Flex>
    </ExampleBox>
  );
}
