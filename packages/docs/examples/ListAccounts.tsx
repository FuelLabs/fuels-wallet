/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Button, Stack, Tag, Text } from '@fuel-ui/react';
import { useState } from 'react';

import { ExampleBox } from '~/src/components/ExampleBox';
import { useFuel } from '~/src/hooks/useFuel';
import { useIsConnected } from '~/src/hooks/useIsConnected';
import { useLoading } from '~/src/hooks/useLoading';

export function ListAccounts() {
  const [fuel, notDetected] = useFuel();
  const [isConnected] = useIsConnected();
  const [accounts, setAccounts] = useState<Array<string>>([]);
  const [handleGetAccounts, isLoadingAccounts, errorGetAccounts] = useLoading(
    async () => {
      console.debug('Request accounts to Wallet!');
      const accounts = await fuel.accounts();
      console.debug('Accounts ', accounts);
      setAccounts(accounts);
    }
  );

  const errorMessage = errorGetAccounts || notDetected;

  return (
    <ExampleBox error={errorMessage}>
      <Stack css={styles.root}>
        <Button
          onPress={handleGetAccounts}
          isLoading={isLoadingAccounts}
          isDisabled={isLoadingAccounts || !isConnected}
        >
          Get accounts
        </Button>
        {Boolean(accounts.length) && (
          <Stack gap="$3" css={{ mt: '$2' }}>
            <Tag size="xs" color="gray" variant="ghost">
              {accounts.map((account) => (
                <Text key={account}>{account}</Text>
              ))}
            </Tag>
          </Stack>
        )}
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
