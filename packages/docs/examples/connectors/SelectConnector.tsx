/* eslint-disable no-console */
import { Alert, Box, Button, Input, Text } from '@fuel-ui/react';
import { useFuel, useConnectors, useIsConnected } from '@fuel-wallet/react';
import { useMemo, useState } from 'react';
import { useLoading } from '~/src/hooks/useLoading';

import { ExampleBox } from '../../src/components/ExampleBox';

export function SelectConnector() {
  const { fuel } = useFuel();
  const { isConnected } = useIsConnected();
  const { connectors } = useConnectors();
  const [selectedConnector, setCurrentConnector] = useState('');

  const [selectConnector, selectingConnector, errorOnSelecting] = useLoading(
    async (connectorName: string) => {
      /* selectConnector:start */
      const isSelected = await fuel.selectConnector(connectorName);
      console.log('isSelected', isSelected);
      /* selectConnector:end */
    }
  );

  const [connectToConnector, connecting, errorOnConnect] = useLoading(
    async () => {
      /* connect:start */
      const connectionState = await fuel.connect();
      console.log('connectionState', connectionState);
      /* connect:end */
    }
  );

  const [handleDisconnect, disconnecting, errorOnDisconnect] = useLoading(
    async () => {
      /* disconnect:start */
      const connectionState = await fuel.disconnect();
      console.log('connectionState', connectionState);
      /* disconnect:end */
    }
  );

  const fuelConnector = useMemo(() => {
    return fuel.getConnector(selectedConnector);
  }, [selectedConnector]);

  return (
    <ExampleBox error={errorOnSelecting || errorOnConnect || errorOnDisconnect}>
      <Input
        as={'select'}
        isDisabled={selectingConnector}
        css={{ color: '$white' }}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onChange={(e) => {
          setCurrentConnector(e.target.value);
          selectConnector(e.target.value);
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
            onPress={connectToConnector}
            isLoading={connecting}
            isDisabled={connecting || disconnecting || !fuelConnector.installed}
          >
            {isConnected ? 'Connected' : 'Connect'}
          </Button>
          <Button
            onPress={handleDisconnect}
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
