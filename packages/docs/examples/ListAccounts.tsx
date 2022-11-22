/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Box, Button, Flex, Text } from '@fuel-ui/react';
import { useState } from 'react';

import { ExampleBox } from '~/components/ExampleBox';
import { useFuelWeb3 } from '~/hooks/useFuelWeb3';
import { useLoading } from '~/hooks/useLoading';

export function ListAccounts() {
  const [FuelWeb3, notDetected] = useFuelWeb3();
  const [connected] = useState(false);
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
      <Flex gap="$4">
        <Button
          onPress={handleGetAccounts}
          isLoading={isLoadingAccounts}
          isDisabled={isLoadingAccounts || !connected}
        >
          Get accounts
        </Button>
        {Boolean(accounts.length) && (
          <Box css={styles.accounts}>
            {accounts.map((account) => (
              <Text key={account}>{account}</Text>
            ))}
          </Box>
        )}
      </Flex>
    </ExampleBox>
  );
}

const styles = {
  accounts: cssObj({
    marginTop: '$2',
    padding: '$2',
    borderRadius: '$lg',
    backgroundColor: '$gray4',
    maxWidth: 300,
    wordWrap: 'break-word',
  }),
};
