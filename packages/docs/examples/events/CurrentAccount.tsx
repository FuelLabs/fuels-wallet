import { cssObj } from '@fuel-ui/css';
import { Box, Button, Tag, Text } from '@fuel-ui/react';
import { useCallback, useEffect, useState } from 'react';

import { ExampleBox } from '../../src/components/ExampleBox';
import { useFuel } from '../../src/hooks/useFuel';
import { useIsConnected } from '../../src/hooks/useIsConnected';
import { useLoading } from '../../src/hooks/useLoading';

export function CurrentAccount() {
  const [fuel, notDetected] = useFuel();
  const [currentAccount, setCurrentAccount] = useState<string>('');
  const [isConnected] = useIsConnected();
  const [handleCurrentAccount, errorCurrentAccount] = useLoading(async () => {
    const currentAccount = await fuel.currentAccount();
    setCurrentAccount(currentAccount || '');
  });

  const [handleConnect, isConnecting, errorConnect] = useLoading(async () => {
    await fuel.connect();
  });

  /* eventCurrentAccount:start */
  const handleAccountEvent = useCallback((account: string) => {
    setCurrentAccount(account);
  }, []);

  useEffect(() => {
    // listen to the current event account, and call the handleAccountEvent
    fuel?.on(fuel.events.currentAccount, handleAccountEvent);
    return () => {
      // remove the listener when the component is unmounted
      fuel?.off(fuel.events.currentAccount, handleAccountEvent);
    };
  }, [fuel, handleAccountEvent]);
  /* eventCurrentAccount:end */

  useEffect(() => {
    if (isConnected) handleCurrentAccount();
  }, [isConnected, handleCurrentAccount]);

  const errorMessage = errorCurrentAccount || notDetected || errorConnect;

  return (
    <ExampleBox error={errorMessage}>
      <Box.Stack css={styles.root}>
        <Box.Stack gap="$3" css={{ mt: '$2' }}>
          {!!currentAccount && (
            <Box.Stack>
              <Text> Current account: </Text>
              <Tag size="xs" variant="ghost">
                <Text key={currentAccount}>{currentAccount}</Text>
              </Tag>
              <Text>
                <em>
                  Change the account in your Fuel wallet to test the event
                </em>
              </Text>
            </Box.Stack>
          )}
          {currentAccount.length < 1 && <Text> No account connected </Text>}
          {!isConnected && (
            <Button
              onPress={handleConnect}
              isLoading={isConnecting}
              isDisabled={!fuel || isConnecting}
            >
              View your account
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
