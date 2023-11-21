import { Box, Button, Text } from '@fuel-ui/react';
import { useConnect, useIsConnected } from '@fuel-wallet/react';

import { ExampleBox } from '../../../src/components/ExampleBox';

export function ConnectHook() {
  /* checkConnection:start */
  const { isConnected } = useIsConnected();
  /* checkConnection:end */
  /* connect:start */
  const { connect, isLoading, error } = useConnect();
  /* connect:end */

  return (
    <ExampleBox error={error}>
      <Box.Flex gap="$4" align={'center'}>
        <Button
          onPress={() => connect()}
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          Connect
        </Button>
        <Text as="span">{isConnected && 'You are connected'}</Text>
      </Box.Flex>
    </ExampleBox>
  );
}
