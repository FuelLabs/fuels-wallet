/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Button, Stack, Tag, Text } from '@fuel-ui/react';
import { useState } from 'react';

import { ExampleBox } from '~/components/ExampleBox';
import { useFuelWeb3 } from '~/hooks/useFuelWeb3';
import { useIsConnected } from '~/hooks/useIsConnected';
import { useLoading } from '~/hooks/useLoading';

export function ListAccounts() {
  const [FuelWeb3, notDetected] = useFuelWeb3();
  const [isConnected] = useIsConnected();
  const [accounts, setAccounts] = useState<string[]>([]);
  const [handleGetAccounts, isLoadingAccounts, errorGetAccounts] = useLoading(
    async () => {
      console.debug('Request accounts to Wallet!');
      const accounts = await FuelWeb3.accounts();
      setAccounts(accounts);
      console.debug('Accounts ', accounts);
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
