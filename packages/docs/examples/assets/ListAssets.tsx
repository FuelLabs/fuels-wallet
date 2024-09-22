import { cssObj } from '@fuel-ui/css';
import { Box, Button, Tag } from '@fuel-ui/react';
import { useFuel, useIsConnected } from '@fuels/react';
import type { Asset } from 'fuels';
import { useState } from 'react';

import { ExampleBox } from '../../src/components/ExampleBox';
import { useLoading } from '../../src/hooks/useLoading';
import { getAssetByChain } from '../../src/utils/getAssetByChain';

export function ListAssets() {
  const { fuel } = useFuel();
  const { isConnected } = useIsConnected();
  const [assets, setAssets] = useState<Array<Asset>>([]);
  const [handleGetAssets, isLoadingAssets, errorGetAssets] = useLoading(
    async () => {
      if (!isConnected) await fuel.connect();
      console.log('Request assets to Wallet!');
      /* assets:start */
      const assets = await fuel.assets();
      console.log('Assets ', assets);
      /* assets:end */
      setAssets(assets);
    }
  );

  return (
    <ExampleBox error={errorGetAssets}>
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
            {assets.map((a) => {
              const asset = getAssetByChain(a, 0);
              if (!asset) return null;

              return (
                <Tag size="xs" variant="ghost" key={JSON.stringify(asset)}>
                  {asset?.name} ({asset?.symbol}): {asset?.assetId}
                </Tag>
              );
            })}
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
