/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Stack, Tag, Button, Text } from '@fuel-ui/react';
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
  const [handleCurrentAccount, isLoadingCurrentAccount, errorCurrentAccount] =
    useLoading(async () => {
      console.debug('Request currentAccount to Wallet!');
      const currentAccount = await fuel.currentAccount();
      setCurrentAccount(currentAccount);
      console.debug('Current Account ', currentAccount);
    });

  const handleAccountEvent = (account: string) => {
    console.log(account);
    setCurrentAccount(account);
  };

  useEffect(() => {
    handleCurrentAccount();
    fuel?.on(FuelWalletEvents.CURRENT_ACCOUNT, handleAccountEvent);
    return () => {
      fuel?.off(FuelWalletEvents.CURRENT_ACCOUNT, handleAccountEvent);
    };
  }, [fuel]);

  const errorMessage = errorCurrentAccount || notDetected;

  return (
    <ExampleBox error={errorMessage}>
      <Stack css={styles.root}>
        <Button
          onPress={handleCurrentAccount}
          isLoading={isLoadingCurrentAccount}
          isDisabled={isLoadingCurrentAccount || !isConnected}
        >
          Get current account
        </Button>
        <Stack gap="$3" css={{ mt: '$2' }}>
          {!!currentAccount && (
            <Tag size="xs" color="gray" variant="ghost">
              <Text key={currentAccount}>{currentAccount}</Text>
            </Tag>
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
