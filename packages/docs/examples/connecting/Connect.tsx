import { Box, Button, Text } from '@fuel-ui/react';
import { useFuel, useIsConnected } from '@fuels/react';

import { ExampleBox } from '../../src/components/ExampleBox';
import { useLoading } from '../../src/hooks/useLoading';

export function Connect() {
  const { fuel } = useFuel();
  const { isConnected } = useIsConnected();
  const [handleConnect, isConnecting, errorConnect] = useLoading(async () => {
    console.log('Request connection to Wallet!');
    /* connect:start */
    const connectionState = await fuel.connect();
    console.log('Connection state', connectionState);
    /* connect:end */
  });

  return (
    <ExampleBox error={errorConnect}>
      <Box.Flex gap="$4" align={'center'}>
        <Button
          onPress={handleConnect}
          isLoading={isConnecting}
          isDisabled={isConnecting}
        >
          Connect
        </Button>
        <Text as="span">{isConnected && 'You are connected'}</Text>
      </Box.Flex>
    </ExampleBox>
  );
}
