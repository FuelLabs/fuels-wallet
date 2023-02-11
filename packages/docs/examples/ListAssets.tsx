/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Button, Stack, Tag, Text } from '@fuel-ui/react';
import { useState } from 'react';

import { ExampleBox } from '~/src/components/ExampleBox';
import { useFuel } from '~/src/hooks/useFuel';
import { useIsConnected } from '~/src/hooks/useIsConnected';
import { useLoading } from '~/src/hooks/useLoading';

export function ListAssets() {
  const [fuel, notDetected] = useFuel();
  const [isConnected] = useIsConnected();
  const [assets, setAssets] = useState<Array<string>>([]);
  const [handleGetAssets, isLoadingAssets, errorGetAssets] = useLoading(
    async () => {
      console.debug('Request assets to Wallet!');
      /* example:start */
      const assets = await fuel.assets();
      console.debug('Assets ', assets);
      /* example:end */
      setAssets(assets);
    }
  );

  const errorMessage = errorGetAssets || notDetected;

  return (
    <ExampleBox error={errorMessage}>
      <Stack css={styles.root}>
        <Button
          onPress={handleGetAssets}
          isLoading={isLoadingAssets}
          isDisabled={isLoadingAssets || !isConnected}
        >
          Get assets
        </Button>
        {Boolean(assets.length) && (
          <Stack gap="$1" css={{ mt: '$2' }}>
            {assets.map((asset) => (
              <Tag
                size="xs"
                color="gray"
                variant="ghost"
                key={JSON.stringify(asset)}
              >
                <Text>{JSON.stringify(asset)}</Text>
              </Tag>
            ))}
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
