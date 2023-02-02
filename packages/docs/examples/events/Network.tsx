/* eslint-disable no-console */
import { Flex, Text, Stack, Button } from '@fuel-ui/react';
import type { FuelProviderConfig } from '@fuel-wallet/sdk';
import { FuelWalletEvents } from '@fuel-wallet/sdk';
import { useEffect, useState } from 'react';

import { Code } from '~/src/components/Code';
import { ExampleBox } from '~/src/components/ExampleBox';
import { useFuel } from '~/src/hooks/useFuel';
import { useIsConnected } from '~/src/hooks/useIsConnected';
import { useLoading } from '~/src/hooks/useLoading';

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
    console.debug('Request Wallet!');
    const network = await fuel.network();
    setNetwork(network);
    console.debug('Connection response', network);
  });

  const handleNetworkChange = (network: FuelProviderConfig) => {
    console.debug('Network event', network);
    setNetwork(network);
  };

  useEffect(() => {
    if (isConnected) handleNetwork();
    fuel?.on(FuelWalletEvents.NETWORK, handleNetworkChange);

    return () => {
      fuel?.off(FuelWalletEvents.NETWORK, handleNetworkChange);
    };
  }, [fuel, isConnected]);

  const errorMessage = errorNetwork || notDetected || errorConnect;

  return (
    <ExampleBox error={errorMessage}>
      <Flex>
        <Stack>
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
            <Button onPress={handleConnect} isLoading={isConnecting}>
              Connect wallet to view your network
            </Button>
          )}
        </Stack>
      </Flex>
    </ExampleBox>
  );
}
