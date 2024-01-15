/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Box, Button, Tag, Text } from '@fuel-ui/react';
import { useState } from 'react';

import { ExampleBox } from '../src/components/ExampleBox';
import { useFuel } from '../src/hooks/useFuel';
import { useIsConnected } from '../src/hooks/useIsConnected';
import { useLoading } from '../src/hooks/useLoading';

export function ListAccounts() {
  const [fuel, notDetected] = useFuel();
  const [isConnected] = useIsConnected();
  const [accounts, setAccounts] = useState<Array<string>>([]);
  const [handleGetAccounts, isLoadingAccounts, errorGetAccounts] = useLoading(
    async () => {
      if (!isConnected) await fuel.connect();
      console.log('Request accounts to Wallet!');
      /* example:start */
      const accounts = await fuel.accounts();
      console.log('Accounts ', accounts);
      /* example:end */
      setAccounts(accounts);
    }
  );

  const errorMessage = errorGetAccounts || notDetected;

  return (
    <ExampleBox error={errorMessage}>
      <Box.Stack css={styles.root}>
        <Button
          onClick={handleGetAccounts}
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
