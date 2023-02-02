/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Button, Stack, Tag, Text } from '@fuel-ui/react';
import { FuelWalletEvents } from '@fuel-wallet/sdk';
import { useEffect, useState } from 'react';

import { ExampleBox } from '~/src/components/ExampleBox';
import { useFuel } from '~/src/hooks/useFuel';
import { useIsConnected } from '~/src/hooks/useIsConnected';
import { useLoading } from '~/src/hooks/useLoading';

export function CurrentAccount() {
  const [fuel, notDetected] = useFuel();
  const [currentAccount, setCurrentAccount] = useState<string>('');
  const [isConnected] = useIsConnected();
  const [handleCurrentAccount, errorCurrentAccount] = useLoading(async () => {
    console.debug('Request currentAccount to Wallet!');
    const currentAccount = await fuel.currentAccount();
    setCurrentAccount(currentAccount);
    console.debug('Current Account ', currentAccount);
  });

  const [handleConnect, isConnecting, errorConnect] = useLoading(async () => {
    await fuel.connect();
  });

  const handleAccountEvent = (account: string) => {
    console.debug('Account event', account);
    setCurrentAccount(account);
  };

  useEffect(() => {
    if (isConnected) handleCurrentAccount();
    fuel?.on(FuelWalletEvents.CURRENT_ACCOUNT, handleAccountEvent);
    return () => {
      fuel?.off(FuelWalletEvents.CURRENT_ACCOUNT, handleAccountEvent);
    };
  }, [fuel, isConnected]);

  const errorMessage = errorCurrentAccount || notDetected || errorConnect;

  return (
    <ExampleBox error={errorMessage}>
      <Stack css={styles.root}>
        <Stack gap="$3" css={{ mt: '$2' }}>
          {!!currentAccount && (
            <Stack>
              <Text> Current account: </Text>
              <Tag size="xs" color="gray" variant="ghost">
                <Text key={currentAccount}>{currentAccount}</Text>
              </Tag>
              <Text>
                <em>
                  {' '}
                  Change the account in your Fuel wallet to test the event{' '}
                </em>
              </Text>
            </Stack>
          )}
          {currentAccount.length < 1 && <Text> No account connected </Text>}
          {!isConnected && (
            <Button onPress={handleConnect} isLoading={isConnecting}>
              {' '}
              Connect wallet to view your account{' '}
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
