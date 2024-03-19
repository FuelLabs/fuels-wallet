'use client';
import { Box, Button, Text } from '@fuel-ui/react';
import { useFuel, useIsConnected } from '@fuels/react';

import { ExampleBox } from '../../src/components/ExampleBox';
import { useLoading } from '../../src/hooks/useLoading';

export function Disconnect() {
  const { fuel } = useFuel();
  const { isConnected } = useIsConnected();
  const [handleDisconnect, isConnecting, errorConnect] = useLoading(
    async () => {
      console.log('Disconnect from Wallet!');
      /* disconnect:start */
      const connectionState = await fuel.disconnect();
      console.log('Connection state', connectionState);
      /* disconnect:end */
    }
  );

  return (
    <ExampleBox error={errorConnect}>
      <Box.Flex gap="$4" align={'center'}>
        <Button
          onPress={handleDisconnect}
          isLoading={isConnecting}
          isDisabled={!isConnected}
        >
          Disconnect
        </Button>
        <Text as="span">{!isConnected && 'You are not connected'}</Text>
      </Box.Flex>
    </ExampleBox>
  );
}
