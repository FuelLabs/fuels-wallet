import { Box, Button, Text } from '@fuel-ui/react';
import { useConnect, useIsConnected } from '@fuels/react';

import { ExampleBox } from '../../../src/components/ExampleBox';

export function ConnectHook() {
  /* checkConnection:start */
  const { isConnected } = useIsConnected();
  /* checkConnection:end */
  /* connect:start */
  const { connect, isPending, error } = useConnect();
  /* connect:end */

  return (
    <ExampleBox error={error}>
      <Box.Flex gap="$4" align={'center'}>
        <Button
          onPress={() => connect(undefined)}
          isLoading={isPending}
          isDisabled={isPending}
        >
          Connect
        </Button>
        <Text as="span">{isConnected && 'You are connected'}</Text>
      </Box.Flex>
    </ExampleBox>
  );
}
