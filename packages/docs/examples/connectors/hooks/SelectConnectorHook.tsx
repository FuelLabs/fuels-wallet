import { Alert, Box, Button, Input, Text } from '@fuel-ui/react';
import {
  useConnect,
  useConnectors,
  useDisconnect,
  useFuel,
  useIsConnected,
} from '@fuels/react';
import { useMemo, useState } from 'react';

import { ExampleBox } from '../../../src/components/ExampleBox';

export function SelectConnectorHook() {
  const { fuel } = useFuel();
  const { isConnected } = useIsConnected();
  /* useConnectors:start */
  const { connectors } = useConnectors();
  const {
    connect,
    isPending: connecting,
    error: errorConnecting,
  } = useConnect();

  function handleConnect(connectorName: string) {
    connect(connectorName);
  }
  /* useConnectors:end */
  const {
    disconnect,
    isPending: disconnecting,
    error: errorDisconnecting,
  } = useDisconnect();
  const [selectedConnector, setCurrentConnector] = useState('');

  const fuelConnector = useMemo(() => {
    return fuel.getConnector(selectedConnector);
  }, [selectedConnector, fuel]);

  return (
    <ExampleBox error={errorDisconnecting || errorConnecting}>
      <Input
        as={'select'}
        isDisabled={connecting}
        css={{ color: '$white' }}
        // @ts-ignore
        onChange={(e) => {
          setCurrentConnector(e.target.value);
          connect(e.target.value);
        }}
      >
        <option>Select connector</option>
        {connectors.map((connector) => {
          const label = `Installed: ${connector.installed} - Connected: ${connector.connected}`;
          return (
            <option key={connector.name} value={connector.name}>
              {connector.name} - {label}
            </option>
          );
        })}
      </Input>
      {fuelConnector && !fuelConnector.installed && (
        <Alert status="warning">
          <Alert.Description>
            You need to install the {fuelConnector.name}.
          </Alert.Description>
        </Alert>
      )}
      {fuelConnector && (
        <Box>
          <Text>Metadata Available to the connector:</Text>
          <Text>{JSON.stringify(fuelConnector?.metadata)}</Text>
        </Box>
      )}
      {fuelConnector && (
        <Box.Flex gap="$4">
          <Button
            onPress={() => handleConnect(selectedConnector)}
            isLoading={connecting}
            isDisabled={connecting || disconnecting || !fuelConnector.installed}
          >
            {isConnected ? 'Connected' : 'Connect'}
          </Button>
          <Button
            onPress={() => disconnect()}
            isLoading={disconnecting}
            isDisabled={
              !isConnected ||
              connecting ||
              disconnecting ||
              !fuelConnector.installed
            }
          >
            {isConnected ? 'Disconnect' : 'Disconnected'}
          </Button>
        </Box.Flex>
      )}
    </ExampleBox>
  );
}
