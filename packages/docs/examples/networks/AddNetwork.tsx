import { cssObj } from '@fuel-ui/css';
import { Box, Button, Input, Text } from '@fuel-ui/react';
import { useFuel, useIsConnected } from '@fuels/react';
import { useState } from 'react';

import { ExampleBox } from '../../src/components/ExampleBox';
import { useLoading } from '../../src/hooks/useLoading';

export function AddNetwork() {
  const { fuel } = useFuel();
  const { isConnected } = useIsConnected();
  const [network, setNetwork] = useState<string>(
    'http://localhost:4000/v1/graphql'
  );

  const [handleAddNetwork, isAddingNetwork, errorAddingNetwork] = useLoading(
    async (network: string) => {
      if (!isConnected) await fuel.connect();
      /* addNetwork:start */
      console.log('Add Network', network);
      const isAdded = await fuel.addNetwork(network);
      console.log('Add Network result', isAdded);
      /* addNetwork:end */
    }
  );

  const onChangeNetwork = (network: string) => {
    setNetwork(network);
  };

  return (
    <ExampleBox error={errorAddingNetwork}>
      <Box.Stack css={styles.wrapper}>
        <Box.Stack>
          <Box.Flex css={styles.itemHeader}>
            <Text>Network</Text>
          </Box.Flex>
          <Box.Flex gap="$2">
            <Input isDisabled={!fuel} css={styles.input}>
              <Input.Field
                defaultValue={network}
                onBlur={(e) => onChangeNetwork(e.target.value)}
                placeholder="Type your network url"
              />
            </Input>
          </Box.Flex>
        </Box.Stack>
        <Box>
          <Button
            onPress={() => handleAddNetwork(network)}
            isLoading={isAddingNetwork}
            isDisabled={isAddingNetwork || !fuel}
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
