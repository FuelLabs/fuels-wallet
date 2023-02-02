/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Stack, Tag, Button, Text } from '@fuel-ui/react';
import { FuelWalletEvents } from '@fuel-wallet/sdk';
import { useEffect, useState } from 'react';

import { ExampleBox } from '~/src/components/ExampleBox';
import { useFuel } from '~/src/hooks/useFuel';
import { useIsConnected } from '~/src/hooks/useIsConnected';
import { useLoading } from '~/src/hooks/useLoading';

export function Accounts() {
  const [fuel, notDetected] = useFuel();
  const [accounts, setAccounts] = useState<string[]>([]);
  const [isConnected] = useIsConnected();
  const [handleAccounts, isLoadingAccounts, errorAccounts] = useLoading(
    async () => {
      console.debug('Request accounts from Wallet!');
      const accounts = await fuel.accounts();
      setAccounts(accounts);
      console.debug('Accounts', accounts);
    }
  );

  const handleAccountsEvent = (accounts: string[]) => {
    setAccounts(accounts);
  };

  useEffect(() => {
    handleAccounts();
    fuel?.on(FuelWalletEvents.ACCOUNTS, handleAccountsEvent);

    return () => {
      fuel?.off(FuelWalletEvents.ACCOUNTS, handleAccountsEvent);
    };
  }, [fuel]);

  const errorMessage = errorAccounts || notDetected;

  return (
    <ExampleBox error={errorMessage}>
      <Stack css={styles.root}>
        <Button
          onPress={handleAccounts}
          isLoading={isLoadingAccounts}
          isDisabled={isLoadingAccounts || !isConnected}
        >
          Get Accounts
        </Button>
        <Stack gap="$3" css={{ mt: '$2' }}>
          {accounts.length > 0 &&
            accounts.map((account) => (
              <Tag size="xs" color="gray" variant="ghost" key={account}>
                <Text key={account}>{account}</Text>
              </Tag>
            ))}
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
