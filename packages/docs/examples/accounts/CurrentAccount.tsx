import { cssObj } from '@fuel-ui/css';
import { Box, Button, Tag, Text } from '@fuel-ui/react';
import { useFuel, useIsConnected } from '@fuels/react';
import { useEffect, useState } from 'react';

import { ExampleBox } from '../../src/components/ExampleBox';
import { useLoading } from '../../src/hooks/useLoading';

export function CurrentAccount() {
  const { fuel } = useFuel();
  const { isConnected } = useIsConnected();
  const [currentAccount, setCurrentAccount] = useState<string>('');
  const [handleCurrentAccount, isLoadingCurrentAccount, errorCurrentAccount] =
    useLoading(async () => {
      if (!isConnected) await fuel.connect();
      console.log('Request currentAccount to Wallet!');
      /* currentAccount:start */
      const currentAccount = await fuel.currentAccount();
      console.log('Current Account', currentAccount);
      /* currentAccount:end */
      setCurrentAccount(currentAccount || '');
    });

  useEffect(() => {
    /* watchCurrentAccount:start */
    function logCurrentAccount(account: string) {
      console.log('Current Account ', account);
    }
    fuel.on(fuel.events.currentAccount, logCurrentAccount);
    /* watchCurrentAccount:end */

    return () => {
      fuel.off(fuel.events.currentAccount, logCurrentAccount);
    };
  }, [fuel]);

  return (
    <ExampleBox error={errorCurrentAccount}>
      <Box.Stack css={styles.root}>
        <Button
          onPress={handleCurrentAccount}
          isLoading={isLoadingCurrentAccount}
          isDisabled={isLoadingCurrentAccount || !fuel}
        >
          Get current account
        </Button>
        <Box.Stack gap="$3" css={{ mt: '$2' }}>
          {currentAccount && (
            <Tag size="xs" variant="ghost">
              <Text key={currentAccount}>{currentAccount}</Text>
            </Tag>
          )}
          {isConnected && !currentAccount && (
            <Text>
              The connection does not have permission for the current account!
            </Text>
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
