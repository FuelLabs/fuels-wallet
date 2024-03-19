import { Box, Button } from '@fuel-ui/react';
import { useConnectUI, useDisconnect, useIsConnected } from '@fuels/react';

import { ExampleBox } from '../../../src/components/ExampleBox';

export function ConnectorUIHook() {
  const { isConnected } = useIsConnected();
  /* useConnectors:start */
  const { connect, isConnecting, error } = useConnectUI();

  function handleConnect() {
    connect();
  }
  /* useConnectors:end */
  const {
    disconnect,
    isPending: disconnecting,
    error: errorDisconnecting,
  } = useDisconnect();

  return (
    <ExampleBox error={error || errorDisconnecting}>
      <Box.Flex gap="$4">
        <Button
          onPress={() => handleConnect()}
          isLoading={isConnecting}
          isDisabled={isConnecting || disconnecting}
        >
          {isConnected ? 'Connected' : 'Connect'}
        </Button>
        <Button
          onPress={() => disconnect()}
          isLoading={disconnecting}
          isDisabled={!isConnected || isConnecting || disconnecting}
        >
          {isConnected ? 'Disconnect' : 'Disconnected'}
        </Button>
      </Box.Flex>
    </ExampleBox>
  );
}
