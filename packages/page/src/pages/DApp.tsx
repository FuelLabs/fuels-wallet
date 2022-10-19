/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Alert, Box, BoxCentered, Button, Text } from '@fuel-ui/react';
import { useCallback, useEffect, useState } from 'react';

const { FuelWeb3 } = window;

function useLoading(callback: () => Promise<void>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const execute = useCallback(async () => {
    setLoading(true);
    callback()
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return [execute, loading, error] as const;
}

export function DApp() {
  const [connected, setConnected] = useState(false);
  const [notDetected, setNotDetected] = useState('');
  const [accounts, setAccounts] = useState<string[]>([]);
  const [handleConnect, isConnecting, error] = useLoading(async () => {
    console.debug('Request connection to Wallet!');
    const isConnected = await FuelWeb3.connect();
    setConnected(isConnected);
    console.debug('Connection response', isConnected);
  });
  const [handleDisconnect, isDisconnecting, errorDisconnect] = useLoading(
    async () => {
      console.debug('Request disconnection to Wallet!');
      await FuelWeb3.disconnect();
      setConnected(false);
      console.debug('Disconnection response');
    }
  );
  const [handleGetAccounts, isLoadingAccounts, errorGetAccounts] = useLoading(
    async () => {
      console.debug('Request accounts to Wallet!');
      const accounts = await FuelWeb3.accounts();
      setAccounts(accounts);
      console.debug('Accounts ', accounts);
    }
  );
  const errorMessage =
    error || errorDisconnect || notDetected || errorGetAccounts;

  useEffect(() => {
    if (FuelWeb3) {
      FuelWeb3.on('accounts', (data) => {
        console.log('accounts', data);
      });
      FuelWeb3.on('connection', (isConnected) => {
        console.log('isConnected', isConnected);
      });
    } else {
      setNotDetected('FuelWeb3 not detected on the window!');
    }
    return () => {
      FuelWeb3?.removeAllListeners();
    };
  }, []);

  return (
    <Box>
      {errorMessage ? (
        <Alert status="warning" css={styles.alert}>
          <Alert.Description>{errorMessage}</Alert.Description>
          {notDetected ? (
            <Alert.Actions>
              <Alert.Button
                variant="link"
                href={import.meta.env.VITE_WALLET_DOWNLOAD_URL}
              >
                Download Wallet
              </Alert.Button>
            </Alert.Actions>
          ) : null}
        </Alert>
      ) : null}
      <BoxCentered minHS minWS gap="$2" direction="column">
        <Button
          onPress={handleConnect}
          isLoading={isConnecting}
          isDisabled={isConnecting || connected}
        >
          {connected ? 'Connected' : 'Connect'}
        </Button>
        <Button
          onPress={handleDisconnect}
          isLoading={isDisconnecting}
          isDisabled={isDisconnecting || !connected}
        >
          {connected ? 'Disconnect' : 'Disconnected'}
        </Button>
        <Button
          onPress={handleGetAccounts}
          isLoading={isLoadingAccounts}
          isDisabled={isLoadingAccounts || !connected}
        >
          Get accounts
        </Button>
        {accounts.length ? (
          <Box css={styles.accounts}>
            {accounts.map((account) => (
              <Text key={account}>{account}</Text>
            ))}
          </Box>
        ) : null}
      </BoxCentered>
    </Box>
  );
}

const styles = {
  accounts: cssObj({
    marginTop: '$2',
    padding: '$2',
    borderRadius: '$lg',
    backgroundColor: '$gray4',
  }),
  alert: cssObj({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    boxShadow: '$lg',
    boxSizing: 'border-box',

    '&, &::after': {
      borderRadius: '$none',
    },
  }),
};
