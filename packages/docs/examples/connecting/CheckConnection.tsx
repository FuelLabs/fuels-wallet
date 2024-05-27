import { Box, Button, Text } from '@fuel-ui/react';
import { useFuel } from '@fuels/react';
import { useEffect, useState } from 'react';

import { ExampleBox } from '../../src/components/ExampleBox';
import { useLoading } from '../../src/hooks/useLoading';

export function CheckConnection() {
  const { fuel } = useFuel();
  const [connected, setConnected] = useState(false);

  const [handleIsConnected, isCheckingConnection, error] = useLoading(
    async () => {
      /* checkConnection:start */
      const connectionState = await fuel.isConnected();
      console.log('Connection state', connectionState);
      /* checkConnection:end */
      setConnected(connectionState);
    }
  );

  useEffect(() => {
    /* watchConnection:start */
    const logConnectionState = (connectionState: boolean) => {
      console.log('connectionState', connectionState);
    };
    fuel.on(fuel.events.connection, logConnectionState);
    /* watchConnection:end */
    return () => {
      fuel.off(fuel.events.connection, logConnectionState);
    };
  }, [fuel]);

  return (
    <ExampleBox error={error}>
      <Box.Flex gap="$4" align={'center'}>
        <Button onPress={handleIsConnected} isLoading={isCheckingConnection}>
          Check Connection
        </Button>
        <Text as="span">
          {connected
            ? 'Your wallet is connected'
            : 'Your wallet is disconnected'}
        </Text>
      </Box.Flex>
    </ExampleBox>
  );
}
