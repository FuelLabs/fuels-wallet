import { cssObj } from '@fuel-ui/css';
import { Box, Button, Tag, Text } from '@fuel-ui/react';
import { useFuel, useIsConnected } from '@fuels/react';
import { useEffect, useState } from 'react';

import { ExampleBox } from '../../src/components/ExampleBox';
import { useLoading } from '../../src/hooks/useLoading';

export function ListAccounts() {
  const { fuel } = useFuel();
  const { isConnected } = useIsConnected();
  const [accounts, setAccounts] = useState<Array<string>>([]);
  const [handleGetAccounts, isLoadingAccounts, errorGetAccounts] = useLoading(
    async () => {
      if (!isConnected) await fuel.connect();
      console.log('Request accounts to Wallet!');
      /* accounts:start */
      const accounts = await fuel.accounts();
      console.log('Accounts', accounts);
      /* accounts:end */
      setAccounts(accounts);
    }
  );

  useEffect(() => {
    /* watchAccounts:start */
    function logAccounts(accounts: string) {
      console.log('Accounts ', accounts);
    }
    fuel.on(fuel.events.accounts, logAccounts);
    /* watchAccounts:end */
    return () => {
      fuel.off(fuel.events.accounts, logAccounts);
    };
  }, [fuel]);

  return (
    <ExampleBox error={errorGetAccounts}>
      <Box.Stack css={styles.root}>
        <Button
          onPress={handleGetAccounts}
          isLoading={isLoadingAccounts}
          isDisabled={isLoadingAccounts || !fuel}
        >
          Get accounts
        </Button>
        {Boolean(accounts.length) && (
          <Box.Stack gap="$1" css={{ mt: '$2' }}>
            {accounts.map((account) => (
              <Tag size="xs" variant="ghost" key={account}>
                <Text>{account}</Text>
              </Tag>
            ))}
          </Box.Stack>
        )}
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
