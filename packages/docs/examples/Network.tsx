/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Button, Stack, Tag, Text } from '@fuel-ui/react';
import { useState } from 'react';

import type { FuelProviderConfig } from '~/../types/src';
import { ExampleBox } from '~/src/components/ExampleBox';
import { useFuel } from '~/src/hooks/useFuel';
import { useIsConnected } from '~/src/hooks/useIsConnected';
import { useLoading } from '~/src/hooks/useLoading';

export function Network() {
  const [fuel, notDetected] = useFuel();
  const [isConnected] = useIsConnected();
  const [network, setNetwork] = useState<FuelProviderConfig>();
  const [handleGetNetwork, isLoadingNetwork, errorGetNetwork] = useLoading(
    async () => {
      if (!isConnected) await fuel.connect();
      console.log('Request the current network');
      /* example:start */
      const networkInfo = await fuel.network();
      console.log('Network ', networkInfo);
      /* example:end */
      setNetwork(networkInfo);
    }
  );

  const errorMessage = errorGetNetwork || notDetected;

  return (
    <ExampleBox error={errorMessage}>
      <Stack css={styles.root}>
        <Button
          onPress={handleGetNetwork}
          isLoading={isLoadingNetwork}
          isDisabled={isLoadingNetwork || !fuel}
        >
          Get network
        </Button>
        <Stack gap="$3" css={{ mt: '$2' }}>
          {network && (
            <Tag size="xs" color="gray" variant="ghost">
              <Text>{network.url}</Text>
            </Tag>
          )}
        </Stack>
      </Stack>
    </ExampleBox>
  );
}

const styles = {
  root: cssObj({
    gap: '$2',
    display: 'inline-flex',
    alignItems: 'flex-start',

    '.fuel_tag': {
      justifyContent: 'flex-start',

      '& > p': {
        fontSize: '$xs',
      },
    },
  }),
};
