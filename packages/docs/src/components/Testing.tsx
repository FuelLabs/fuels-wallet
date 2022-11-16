/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Alert, Box, Button, Text, Link, Input, Flex } from '@fuel-ui/react';
import { FuelWeb3Provider, getBlockExplorerLink } from '@fuel-wallet/sdk';
import type { BN } from 'fuels';
import { Address, Wallet, bn } from 'fuels';
import { useCallback, useEffect, useState } from 'react';

const globalWindow = typeof window !== 'undefined' ? window : ({} as Window);

// This is not need if the developer
// install FuelWeb3 and import as a package
function useFuelWeb3() {
  const [error, setError] = useState('');
  const [fuelWeb3, setFuelWeb3] = useState<Window['FuelWeb3']>(
    globalWindow.FuelWeb3
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (globalWindow.FuelWeb3) {
        setFuelWeb3(globalWindow.FuelWeb3);
      } else {
        setError('FuelWeb3 not detected on the window!');
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  return [fuelWeb3, error] as const;
}

function useLoading<T extends (...args: any) => Promise<void>>(
  callback: T,
  deps: any = []
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const execute = useCallback(
    async (...args: any) => {
      setError(null);
      setLoading(true);
      callback(...args)
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [...deps]
  );

  return [execute as T, loading, error] as const;
}

export function Testing() {
  const [FuelWeb3, notDetected] = useFuelWeb3();
  const [connected, setConnected] = useState(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [signedMessage, setSignedMessage] = useState<string>('');
  const [message, setMessage] = useState<string>('Message to sign');
  const [amount, setAmount] = useState<string>('0.00001');
  const [txId, setTxId] = useState<string>('');
  const [handleConnect, isConnecting, errorConnect] = useLoading(async () => {
    console.debug('Request connection to Wallet!');
    const isConnected = await globalWindow.FuelWeb3.connect();
    setConnected(isConnected);
    console.debug('Connection response', isConnected);
  });

  const [handleDisconnect, isDisconnecting, errorDisconnect] = useLoading(
    async () => {
      console.debug('Request disconnection to Wallet!');
      await globalWindow.FuelWeb3.disconnect();
      setConnected(false);
      console.debug('Disconnection response');
    }
  );

  const [handleGetAccounts, isLoadingAccounts, errorGetAccounts] = useLoading(
    async () => {
      console.debug('Request accounts to Wallet!');
      const accounts = await globalWindow.FuelWeb3.accounts();
      setAccounts(accounts);
      console.debug('Accounts ', accounts);
    }
  );

  const [handleSignMessage, isSingingMessage, errorSigningMessage] = useLoading(
    async (message: string) => {
      console.debug('Request signature of message!');
      const accounts = await window.FuelWeb3.accounts();
      const account = accounts[0];
      const signedMessage = await globalWindow.FuelWeb3.signMessage(
        account,
        message
      );
      setSignedMessage(signedMessage);
      console.debug('Message signature', signedMessage);
    },
    [accounts]
  );
  const [sendTransaction, sendingTransaction, errorSendingTransaction] =
    useLoading(
      async (amount: BN) => {
        console.debug('Request signature transaction!');
        const accounts = await window.FuelWeb3.accounts();
        const account = accounts[0];
        const provider = new FuelWeb3Provider(window.FuelWeb3);
        const wallet = Wallet.fromAddress(account, provider);
        const response = await wallet.transfer(
          Address.fromString(
            'fuel1r3u2qfn00cgwk3u89uxuvz5cgcjaq934cfer6cwuew0424cz5sgq4yldul'
          ),
          amount
        );
        setTxId(response.id);
      },
      [accounts]
    );
  const errorMessage =
    errorConnect ||
    errorDisconnect ||
    notDetected ||
    errorGetAccounts ||
    errorSigningMessage ||
    errorSendingTransaction;

  useEffect(() => {
    if (FuelWeb3) {
      FuelWeb3.on('accounts', (data) => {
        console.log('accounts', data);
      });
      FuelWeb3.on('connection', (isConnected) => {
        console.log('isConnected', isConnected);
      });
    }
    return () => {
      FuelWeb3?.removeAllListeners();
    };
  }, [FuelWeb3]);

  return (
    <Box css={styles.page}>
      {errorMessage ? (
        <Alert status="warning" css={styles.alert}>
          <Alert.Description>{errorMessage}</Alert.Description>
          {notDetected ? (
            <Alert.Actions>
              <Link
                download={true}
                href={process.env.NEXT_PUBLIC_WALLET_DOWNLOAD_URL}
              >
                Download Wallet
              </Link>
            </Alert.Actions>
          ) : null}
        </Alert>
      ) : null}
      <Flex gap="$2" direction="column">
        <Text as="h1">Connection</Text>
        <Flex gap="$4">
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
        </Flex>
        {accounts.length ? (
          <Box css={styles.accounts}>
            {accounts.map((account) => (
              <Text key={account}>{account}</Text>
            ))}
          </Box>
        ) : null}
        <Text as="h1" css={{ marginTop: '$4' }}>
          Sign Message
        </Text>
        <Input isDisabled={!connected} css={{ width: 300, height: 100 }}>
          <Input.Field
            as="textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your title"
            css={{ color: '$whiteA11', padding: '$2' }}
          />
        </Input>
        <Box>
          <Button
            onPress={() => handleSignMessage(message)}
            isLoading={isSingingMessage}
            isDisabled={isSingingMessage || !connected}
          >
            Sign Message
          </Button>
        </Box>
        {signedMessage ? (
          <Box css={styles.accounts}>
            <Text>{signedMessage}</Text>
          </Box>
        ) : null}
        <Text as="h1" css={{ marginTop: '$4' }}>
          Transfer
        </Text>
        <Input isDisabled={!connected}>
          <Input.Field
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            css={{ color: '$whiteA11' }}
          />
        </Input>
        <Button
          onPress={() => sendTransaction(bn.parseUnits(amount))}
          isLoading={sendingTransaction}
          isDisabled={sendingTransaction || !connected}
        >
          Transfer
        </Button>
        {txId ? (
          <Box css={styles.accounts}>
            <Text>{txId}</Text>
            <Link
              target={'_blank'}
              href={getBlockExplorerLink({
                path: `transaction/${txId}`,
                providerUrl: FuelWeb3.providerConfig.url,
              })}
            >
              See on BlockExplorer
            </Link>
          </Box>
        ) : null}
      </Flex>
    </Box>
  );
}

const styles = {
  page: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$8',

    '.fuel_alert--content': {
      gap: '$1',
    },
  }),
  accounts: cssObj({
    marginTop: '$2',
    padding: '$2',
    borderRadius: '$lg',
    backgroundColor: '$gray4',
    maxWidth: 300,
    wordWrap: 'break-word',
  }),
  alert: cssObj({
    boxShadow: '$none',
    boxSizing: 'border-box',

    '&, &::after': {
      borderRadius: '$none',
    },
  }),
};
