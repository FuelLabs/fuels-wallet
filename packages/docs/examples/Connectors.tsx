/* eslint-disable no-console */
import { Box, Button, Input } from '@fuel-ui/react';
import { useEffect, useState } from 'react';
import type { FuelWalletConnector } from '~/../types/src';
import { ExampleBox } from '~/src/components/ExampleBox';
import { useFuel } from '~/src/hooks/useFuel';
import { useLoading } from '~/src/hooks/useLoading';

export function Connectors() {
  const [fuel, notDetected] = useFuel();
  const [connected, setConnected] = useState(false);
  const [compatibilityError, setCompatibilityError] = useState('');
  const [connectors, setConnectors] = useState<Array<FuelWalletConnector>>([]);

  useEffect(() => {
    if (!fuel) return () => {};
    const onCurrentConnector = async () => {
      console.log('Current connector changed!');
      const isConnected = await fuel.isConnected();
      setConnected(isConnected);
    };
    /* eventCurrentConnector:start */
    fuel.on(fuel.events.currentConnector, onCurrentConnector);
    return () => {
      fuel.off(fuel.events.currentConnector, onCurrentConnector);
    };
    /* eventCurrentConnector:end */
  }, [fuel]);

  useEffect(() => {
    if (!fuel) return () => {};
    if (!fuel.listConnectors) {
      setCompatibilityError(
        "Current version of Fuel Wallet doesn't support Connectors!"
      );
      return () => {};
    }
    setCompatibilityError('');

    /* listConnectors:start */
    const connectors = fuel.listConnectors();
    /* listConnectors:end */
    setConnectors(connectors);

    const onConnectors = () => {
      setConnectors(Array.from(fuel.listConnectors()));
    };

    /* eventConnectors:start */
    fuel.on(fuel.events.connectors, onConnectors);
    return () => {
      fuel.off(fuel.events.connectors, onConnectors);
    };
    /* eventConnectors:end */
  }, [fuel]);

  const [handleConnect, isConnecting, errorConnect] = useLoading(async () => {
    console.log('Request connection to Wallet!');
    const isConnected = await fuel.connect();
    console.log('Connection response', isConnected);
    setConnected(isConnected);
  });

  const [handleDisconnect, isDisconnecting, errorDisconnect] = useLoading(
    async () => {
      console.log('Request disconnection to Wallet!');
      await fuel.disconnect();
      setConnected(false);
      console.log('Disconnection response');
    }
  );

  const [handleSelectConnector, isSelecting, errorConnector] = useLoading(
    /* selectConnector:start */
    async (connectorName: string) => {
      console.log(`Select connector "${connectorName}"!`);
      await fuel.selectConnector(connectorName);
      console.log(`Connector "${connectorName}" connected`);
    }
    /* selectConnector:end */
  );

  const errorMessage =
    errorConnect || errorDisconnect || notDetected || errorConnector;

  return (
    <ExampleBox error={errorMessage} overlayContent={compatibilityError}>
      <Input
        as={'select'}
        isDisabled={!connectors.length || isSelecting}
        css={{ color: '$white' }}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onChange={(e) => {
          handleSelectConnector(e.target.value);
        }}
      >
        {connectors.map((connector) => (
          <option key={connector.name} value={connector.name}>
            {connector.name}
          </option>
        ))}
      </Input>
      <Box.Flex gap="$4">
        <Button
          onPress={handleConnect}
          isLoading={isConnecting}
          isDisabled={isConnecting || connected || !fuel}
        >
          {connected ? 'Connected' : 'Connect'}
        </Button>
        <Button
          onPress={handleDisconnect}
          isLoading={isDisconnecting}
          isDisabled={isDisconnecting || !connected || !fuel}
        >
          {connected ? 'Disconnect' : 'Disconnected'}
        </Button>
      </Box.Flex>
    </ExampleBox>
  );
}
