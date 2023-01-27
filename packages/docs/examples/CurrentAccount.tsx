/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Button, Stack, Tag, Text } from '@fuel-ui/react';
import { useState } from 'react';

import { ExampleBox } from '~/src/components/ExampleBox';
import { useFuel } from '~/src/hooks/useFuel';
import { useIsConnected } from '~/src/hooks/useIsConnected';
import { useLoading } from '~/src/hooks/useLoading';

export function CurrentAccount() {
  const [fuel, notDetected] = useFuel();
  const [isConnected] = useIsConnected();
  const [currentAccount, setCurrentAccount] = useState<string>('');
  const [handleCurrentAccount, isLoadingCurrentAccount, errorCurrentAccount] =
    useLoading(async () => {
      console.debug('Request currentAccount to Wallet!');
      const currentAccount = await fuel.currentAccount();
      console.debug('Current Account ', currentAccount);
      setCurrentAccount(currentAccount);
    });

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
