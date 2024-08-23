import { cssObj } from '@fuel-ui/css';
import { Box, Button, Tag, Text } from '@fuel-ui/react';
import { useAccount, useConnect, useFuel, useIsConnected } from '@fuels/react';

import { ExampleBox } from '../../../src/components/ExampleBox';

export function CurrentAccountHook() {
  const { fuel } = useFuel();
  const { connect, isPending: isConnecting, error } = useConnect();
  const { isConnected } = useIsConnected();
  /* useAccount:start */
  const { account } = useAccount();
  /* useAccount:end */

  return (
    <ExampleBox error={error}>
      <Box.Stack css={styles.root}>
        <Box.Stack gap="$3" css={{ mt: '$2' }}>
          {!!account && (
            <Box.Stack>
              <Text> Current account: </Text>
              <Tag size="xs" variant="ghost">
                <Text key={account}>{account}</Text>
              </Tag>
              <Text>
                <em>
                  Change the account in your Fuel wallet to test the event
                </em>
              </Text>
            </Box.Stack>
          )}
          {isConnected && !account && (
            <Text> The current account is not connected </Text>
          )}
          {!isConnected && (
            <Button
              onPress={() => connect(undefined)}
              isLoading={isConnecting}
              isDisabled={!fuel || isConnecting}
            >
              Connect
            </Button>
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
