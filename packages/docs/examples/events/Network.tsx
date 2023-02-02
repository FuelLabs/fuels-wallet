/* eslint-disable no-console */
import { Flex, Button, Text, Stack } from '@fuel-ui/react';
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

  const [handleNetwork, isLoadingNetwork, errorNetwork] = useLoading(
    async () => {
      console.debug('Request Wallet!');
      const network = await fuel.network();
      setNetwork(network);
      console.debug('Connection response', network);
    }
  );

  const handleNetworkChange = (network: FuelProviderConfig) => {
    setNetwork(network);
  };

  useEffect(() => {
    fuel?.on(FuelWalletEvents.NETWORK, handleNetworkChange);
    handleNetwork();

    return () => {
      fuel?.off(FuelWalletEvents.NETWORK, handleNetworkChange);
    };
  }, [fuel]);

  const errorMessage = errorNetwork || notDetected;

  return (
    <ExampleBox error={errorMessage}>
      <Flex>
        {currentNetwork ? (
          <Stack>
            <Text>Current network config </Text>
            <Code> {JSON.stringify(currentNetwork)} </Code>
          </Stack>
        ) : null}
      </Flex>
      <Flex gap="$4">
        {!currentNetwork ? (
          <Button
            onPress={handleNetwork}
            isLoading={isLoadingNetwork}
            isDisabled={isLoadingNetwork || !isConnected}
          >
            Change Network
          </Button>
        ) : null}
      </Flex>
    </ExampleBox>
  );
}
