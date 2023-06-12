import { Button, Flex, Text } from '@fuel-ui/react';

import { ExampleBox } from '../../src/components/ExampleBox';
import { useFuel } from '../../src/hooks/useFuel';
import { useIsConnected } from '../../src/hooks/useIsConnected';
import { useLoading } from '../../src/hooks/useLoading';

export function Connection() {
  const [fuel, notDetected] = useFuel();
  const [isConnected] = useIsConnected();

  const [handleConnect, isConnecting, errorConnect] = useLoading(async () => {
    await fuel?.connect();
  });

  const [handleDisconnect, isDisconnecting, errorDisconnect] = useLoading(
    async () => {
      await fuel?.disconnect();
    }
  );

  const errorMessage = errorConnect || errorDisconnect || notDetected;

  return (
    <ExampleBox error={errorMessage}>
      <Flex>
        {isConnected ? (
          <Text> You are connected to the Fuel Wallet. </Text>
        ) : (
          <Text>You are not connected to the Fuel Wallet.</Text>
        )}
      </Flex>
      <Flex gap="$4">
        {!isConnected ? (
          <Button
            onPress={handleConnect}
            isLoading={isConnecting}
            isDisabled={isConnecting || isConnected || !fuel}
          >
            Connect
          </Button>
        ) : null}
        {isConnected ? (
          <Button
            onPress={handleDisconnect}
            isLoading={isDisconnecting}
            isDisabled={isDisconnecting || !isConnected || !fuel}
          >
            Disconnect
          </Button>
        ) : null}
      </Flex>
    </ExampleBox>
  );
}
