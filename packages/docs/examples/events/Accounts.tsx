import { cssObj } from '@fuel-ui/css';
import { Box, Button, Tag, Text } from '@fuel-ui/react';
import { useCallback, useEffect, useState } from 'react';

import { ExampleBox } from '../../src/components/ExampleBox';
import { useFuel } from '../../src/hooks/useFuel';
import { useIsConnected } from '../../src/hooks/useIsConnected';
import { useLoading } from '../../src/hooks/useLoading';

export function Accounts() {
  /* useFuel:start */
  const [fuel, notDetected] = useFuel();
  /* useFuel:end */
  const [accounts, setAccounts] = useState<string[]>([]);
  /* useisConnected:start */
  const [isConnected] = useIsConnected();
  /* useisConnected:end */
  const [handleAccounts, errorAccounts] = useLoading(async () => {
    const accounts = await fuel.accounts();
    setAccounts(accounts);
  });

  const [handleConnect, isConnecting, errorConnect] = useLoading(async () => {
    await fuel.connect();
  });

  /* eventAccountChanges:start */
  const handleAccountsEvent = useCallback((accounts: string[]) => {
    setAccounts(accounts);
  }, []);

  useEffect(() => {
    fuel?.on(fuel.events.accounts, handleAccountsEvent);
    return () => {
      fuel?.off(fuel.events.accounts, handleAccountsEvent);
    };
  }, [fuel, handleAccountsEvent]);
  /* eventAccountChanges:end */

  useEffect(() => {
    if (isConnected) handleAccounts();
  }, [isConnected, handleAccounts]);

  const errorMessage = errorAccounts || notDetected || errorConnect;

  return (
    <ExampleBox error={errorMessage}>
      <Box.Stack css={styles.root}>
        <Box.Stack gap="$3" css={{ mt: '$2' }}>
          <Text> All connected accounts: </Text>
          {accounts.length > 0 ? (
            <>
              {accounts.map((account) => (
                <Tag size="xs" variant="ghost" key={account}>
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
        </Box.Stack>
      </Box.Stack>
    </ExampleBox>
  );
}

const styles = {
  root: cssObj({
    gap: '$2',
    display: 'inline-flex',
    alignItems: 'flex-start',

    '.fuel_Tag > p': {
      fontSize: '$sm',
    },
  }),
};
