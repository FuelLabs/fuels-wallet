/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Box, Button, Tag, Text } from '@fuel-ui/react';
import { useState } from 'react';

import { ExampleBox } from '../src/components/ExampleBox';
import { useFuel } from '../src/hooks/useFuel';
import { useIsConnected } from '../src/hooks/useIsConnected';
import { useLoading } from '../src/hooks/useLoading';

export function CurrentAccount() {
  const [fuel, notDetected] = useFuel();
  const [isConnected] = useIsConnected();
  const [currentAccount, setCurrentAccount] = useState<string>('');
  const [handleCurrentAccount, isLoadingCurrentAccount, errorCurrentAccount] =
    useLoading(async () => {
      if (!isConnected) await fuel.connect();
      console.log('Request currentAccount to Wallet!');
      /* example:start */
      const currentAccount = await fuel.currentAccount();
      console.log('Current Account ', currentAccount);
      /* example:end */
      setCurrentAccount(currentAccount);
    });

  const errorMessage = errorCurrentAccount || notDetected;

  return (
    <ExampleBox error={errorMessage}>
      <Box.Stack css={styles.root}>
        <Button
          onClick={handleCurrentAccount}
          isLoading={isLoadingCurrentAccount}
          isDisabled={isLoadingCurrentAccount || !fuel}
        >
          Get current account
        </Button>
        <Box.Stack gap="$3" css={{ mt: '$2' }}>
          {!!currentAccount && (
            <Tag size="xs" variant="ghost">
              <Text key={currentAccount}>{currentAccount}</Text>
            </Tag>
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
