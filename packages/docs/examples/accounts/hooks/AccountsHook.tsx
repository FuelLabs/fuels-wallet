import { cssObj } from '@fuel-ui/css';
import { Box, Button, Tag, Text } from '@fuel-ui/react';
import { useAccounts, useConnect, useIsConnected } from '@fuels/react';

import { ExampleBox } from '../../../src/components/ExampleBox';

export function AccountsHook() {
  const { connect, isPending: isConnecting, error } = useConnect();
  const { isConnected } = useIsConnected();
  /* useAccounts:start */
  const { accounts } = useAccounts();
  /* useAccounts:end */

  return (
    <ExampleBox error={error}>
      <Box.Stack css={styles.root}>
        <Box.Stack gap="$3" css={{ mt: '$2' }}>
          {accounts.length > 0 ? (
            <>
              <Text> All connected accounts: </Text>
              {accounts.map((account) => (
                <Tag size="xs" variant="ghost" key={account}>
                  <Text key={account}>{account}</Text>
                </Tag>
              ))}
              <Text>
                <em>
                  Connect / Disconnect accounts in your Fuel wallet to test the
                  event.
                </em>
              </Text>
            </>
          ) : (
            <Text> No accounts connected </Text>
          )}
          <Box>
            {!isConnected && (
              <Button
                onPress={() => connect(undefined)}
                isLoading={isConnecting}
                isDisabled={isConnecting}
              >
                Connect
              </Button>
            )}
          </Box>
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
