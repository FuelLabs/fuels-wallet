import { Box, Button, Text } from '@fuel-ui/react';
import type { Network } from 'fuels';
import { useCallback, useEffect, useState } from 'react';

import { Code } from '../../src/components/Code';
import { ExampleBox } from '../../src/components/ExampleBox';
import { useFuel } from '../../src/hooks/useFuel';
import { useIsConnected } from '../../src/hooks/useIsConnected';
import { useLoading } from '../../src/hooks/useLoading';

export function NetworkExample() {
  const [fuel, notDetected] = useFuel();
  const [isConnected] = useIsConnected();
  const [currentNetwork, setNetwork] = useState<Network | null>(null);

  const [handleConnect, isConnecting, errorConnect] = useLoading(async () => {
    await fuel.connect();
  });

  const [handleNetwork, errorNetwork] = useLoading(async () => {
    const network = await fuel.currentNetwork();
    setNetwork(network);
  });

  /* network:start */
  const handleNetworkChange = useCallback((network: Network) => {
    setNetwork(network);
  }, []);

  useEffect(() => {
    fuel?.on(fuel.events.currentNetwork, handleNetworkChange);

    return () => {
      fuel?.off(fuel.events.currentNetwork, handleNetworkChange);
    };
  }, [fuel, handleNetworkChange]);
  /* network:end */

  useEffect(() => {
    if (isConnected) handleNetwork();
  }, [isConnected, handleNetwork]);

  const errorMessage = errorNetwork || notDetected || errorConnect;

  return (
    <ExampleBox error={errorMessage}>
      <Box.Flex>
        <Box.Stack>
          {currentNetwork ? (
            <>
              <Text>Current network config </Text>
              <Code> {JSON.stringify(currentNetwork)} </Code>
              <Text>
                <em>
                  Change the account in your Fuel wallet to see the event
                  triggered.
                </em>
              </Text>
            </>
          ) : (
            <Text> No network connected </Text>
          )}
          {!isConnected && (
            <Button
              onPress={handleConnect}
              isLoading={isConnecting}
              isDisabled={!fuel || isConnecting}
            >
              View your network
            </Button>
          )}
        </Box.Stack>
      </Box.Flex>
    </ExampleBox>
  );
}
