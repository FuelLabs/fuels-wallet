/* eslint-disable no-console */
import { Flex, Button } from '@fuel-ui/react';
import { useState } from 'react';

import { ExampleBox } from '~/src/components/ExampleBox';
import { useFuelWeb3 } from '~/src/hooks/useFuelWeb3';
import { useLoading } from '~/src/hooks/useLoading';

export function Connect() {
  const [FuelWeb3, notDetected] = useFuelWeb3();
  const [connected, setConnected] = useState(false);

  const [handleConnect, isConnecting, errorConnect] = useLoading(async () => {
    console.debug('Request connection to Wallet!');
    const isConnected = await FuelWeb3.connect();
    setConnected(isConnected);
    console.debug('Connection response', isConnected);
  });

  const [handleDisconnect, isDisconnecting, errorDisconnect] = useLoading(
    async () => {
      console.debug('Request disconnection to Wallet!');
      await FuelWeb3.disconnect();
      setConnected(false);
      console.debug('Disconnection response');
    }
  );

  const errorMessage = errorConnect || errorDisconnect || notDetected;

  return (
    <ExampleBox error={errorMessage}>
      <Flex gap="$4">
        <Button
          onPress={handleConnect}
          isLoading={isConnecting}
          isDisabled={isConnecting || connected}
        >
          {connected ? 'Connected' : 'Connect'}
        </Button>
        <Button
          onPress={handleDisconnect}
          isLoading={isDisconnecting}
          isDisabled={isDisconnecting || !connected}
        >
          {connected ? 'Disconnect' : 'Disconnected'}
        </Button>
      </Flex>
    </ExampleBox>
  );
}
