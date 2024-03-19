'use client';
import { Box, Button, Text } from '@fuel-ui/react';
import { useDisconnect, useIsConnected } from '@fuels/react';

import { ExampleBox } from '../../../src/components/ExampleBox';

export function DisconnectHook() {
  const { isConnected } = useIsConnected();
  /* disconnect:start */
  const { disconnect, isPending, error } = useDisconnect();
  /* disconnect:end */

  return (
    <ExampleBox error={error}>
      <Box.Flex gap="$4" align={'center'}>
        <Button
          onPress={() => disconnect()}
          isLoading={isPending}
          isDisabled={!isConnected}
        >
          Disconnect
        </Button>
        <Text as="span">{!isConnected && 'You are not connected'}</Text>
      </Box.Flex>
    </ExampleBox>
  );
}
