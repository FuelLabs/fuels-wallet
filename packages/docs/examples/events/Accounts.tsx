import { cssObj } from '@fuel-ui/css';
import { Button, Stack, Tag, Text } from '@fuel-ui/react';
import { useEffect, useState } from 'react';

import { ExampleBox } from '../../src/components/ExampleBox';
import { useFuel } from '../../src/hooks/useFuel';
import { useIsConnected } from '../../src/hooks/useIsConnected';
import { useLoading } from '../../src/hooks/useLoading';

export function Accounts() {
  const [fuel, notDetected] = useFuel();
  const [accounts, setAccounts] = useState<string[]>([]);
  const [isConnected] = useIsConnected();
  const [handleAccounts, errorAccounts] = useLoading(async () => {
    const accounts = await fuel.accounts();
    setAccounts(accounts);
  });

  const [handleConnect, isConnecting, errorConnect] = useLoading(async () => {
    await fuel.connect();
  });

  const handleAccountsEvent = (accounts: string[]) => {
    setAccounts(accounts);
  };

  useEffect(() => {
    fuel?.on(fuel.events.accounts, handleAccountsEvent);
    return () => {
      fuel?.off(fuel.events.accounts, handleAccountsEvent);
    };
  }, [fuel]);

  useEffect(() => {
    if (isConnected) handleAccounts();
  }, [isConnected]);

  const errorMessage = errorAccounts || notDetected || errorConnect;

  return (
    <ExampleBox error={errorMessage}>
      <Stack css={styles.root}>
        <Stack gap="$3" css={{ mt: '$2' }}>
          <Text> All connected accounts: </Text>
          {accounts.length > 0 ? (
            <>
              {accounts.map((account) => (
                <Tag size="xs" color="gray" variant="ghost" key={account}>
                  <Text key={account}>{account}</Text>
                </Tag>
              ))}
              <Text>
                <em>
                  Connect / Disconnect accounts in your Fuel wallet to test the
                  event.
                </em>
              </Text>
            </>
          ) : (
            <Text> No accounts connected </Text>
          )}
          {!isConnected && (
            <Button
              onPress={handleConnect}
              isLoading={isConnecting}
              isDisabled={!fuel || isConnecting}
            >
              View your accounts
            </Button>
          )}
        </Stack>
      </Stack>
    </ExampleBox>
  );
}

const styles = {
  root: cssObj({
    gap: '$2',
    display: 'inline-flex',
    alignItems: 'flex-start',

    '.fuel_tag > p': {
      fontSize: '$xs',
    },
  }),
};
