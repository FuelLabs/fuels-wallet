/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Box, Button, Tag } from '@fuel-ui/react';
import type { Asset } from '@fuel-wallet/sdk';
import { useState } from 'react';

import { ExampleBox } from '../src/components/ExampleBox';
import { useFuel } from '../src/hooks/useFuel';
import { useIsConnected } from '../src/hooks/useIsConnected';
import { useLoading } from '../src/hooks/useLoading';

export function ListAssets() {
  const [fuel, notDetected] = useFuel();
  const [isConnected] = useIsConnected();
  const [assets, setAssets] = useState<Array<Asset>>([]);
  const [handleGetAssets, isLoadingAssets, errorGetAssets] = useLoading(
    async () => {
      if (!isConnected) await fuel.connect();
      console.log('Request assets to Wallet!');
      /* example:start */
      const assets = await fuel.assets();
      console.log('Assets ', assets);
      /* example:end */
      setAssets(assets);
    }
  );

  const errorMessage = errorGetAssets || notDetected;

  return (
    <ExampleBox error={errorMessage}>
      <Box.Stack css={styles.root}>
        <Button
          onPress={handleGetAssets}
          isLoading={isLoadingAssets}
          isDisabled={isLoadingAssets || !fuel}
        >
          Get assets
        </Button>
        {Boolean(assets.length) && (
          <Box.Stack gap="$1" css={{ mt: '$2' }}>
            {assets.map((asset) => (
              <Tag size="xs" variant="ghost" key={JSON.stringify(asset)}>
                {asset.name} ({asset.symbol}): {asset.assetId}
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

    '.fuel_Tag': {
      justifyContent: 'flex-start',

      '& > p': {
        fontSize: '$sm',
      },
    },
  }),
};
