import { Text, Button, Box } from '@fuel-ui/react';
import type { FuelProviderConfig } from '@fuel-wallet/sdk';
import { useEffect, useState } from 'react';

import { Code } from '../../src/components/Code';
import { ExampleBox } from '../../src/components/ExampleBox';
import { useFuel } from '../../src/hooks/useFuel';
import { useIsConnected } from '../../src/hooks/useIsConnected';
import { useLoading } from '../../src/hooks/useLoading';

export function NetworkExample() {
  const [fuel, notDetected] = useFuel();
  const [isConnected] = useIsConnected();
  const [currentNetwork, setNetwork] = useState<FuelProviderConfig | null>(
    null
  );

  const [handleConnect, isConnecting, errorConnect] = useLoading(async () => {
    await fuel.connect();
  });

  const [handleNetwork, errorNetwork] = useLoading(async () => {
    const network = await fuel.network();
    setNetwork(network);
  });

  /* network:start */
  const handleNetworkChange = (network: FuelProviderConfig) => {
    setNetwork(network);
  };

  useEffect(() => {
    fuel?.on(fuel.events.network, handleNetworkChange);

    return () => {
      fuel?.off(fuel.events.network, handleNetworkChange);
    };
  }, [fuel]);
  /* network:end */

  useEffect(() => {
    if (isConnected) handleNetwork();
  }, [isConnected]);

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
