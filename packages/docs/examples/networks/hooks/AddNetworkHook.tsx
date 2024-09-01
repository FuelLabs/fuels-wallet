import { cssObj } from '@fuel-ui/css';
import { Box, Button, Input, Text } from '@fuel-ui/react';
import {
  useAddNetwork,
  useConnect,
  useFuel,
  useIsConnected,
} from '@fuels/react';
import { useState } from 'react';

import { ExampleBox } from '../../../src/components/ExampleBox';

export function AddNetworkHook() {
  const { fuel } = useFuel();
  const { isConnected } = useIsConnected();
  const { connect, error: errorConnecting } = useConnect();
  const [network, setNetwork] = useState<string>(
    'http://localhost:4000/v1/graphql'
  );
  /* useAddNetwork:start */
  const { addNetwork, isPending, error } = useAddNetwork();

  async function handleAddNetwork(networkUrl: string) {
    if (!isConnected) connect(undefined); // ignore-line
    console.log('Add network', networkUrl);
    const networkAdded = await addNetwork(networkUrl);
    console.log('Network added', networkAdded);
  }
  /* useAddNetwork:end */

  return (
    <ExampleBox error={error || errorConnecting}>
      <Box.Stack css={styles.wrapper}>
        <Box.Stack>
          <Box.Flex css={styles.itemHeader}>
            <Text>Network</Text>
          </Box.Flex>
          <Box.Flex gap="$2">
            <Input isDisabled={!fuel} css={styles.input}>
              <Input.Field
                defaultValue={network}
                onBlur={(e) => setNetwork(e.target.value)}
                placeholder="Type your network url"
              />
            </Input>
          </Box.Flex>
        </Box.Stack>
        <Box>
          <Button
            onPress={() => handleAddNetwork(network)}
            isLoading={isPending}
            isDisabled={isPending || !isConnected}
          >
            Add Network
          </Button>
        </Box>
      </Box.Stack>
    </ExampleBox>
  );
}

const styles = {
  msg: cssObj({
    borderRadius: '$md',
    height: 'auto',
    maxWidth: 320,
    wordBreak: 'break-all',
  }),
  wrapper: cssObj({
    gap: '$4',
  }),
  item: (isLast: boolean) =>
    cssObj({
      gap: '$2',
      mb: isLast ? '0' : '$4',
    }),
  input: cssObj({
    width: '100%',
  }),
  itemHeader: cssObj({
    gap: '$2',
    alignItems: 'center',
    justifyContent: 'space-between',
  }),
};
