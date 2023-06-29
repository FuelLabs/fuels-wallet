import { cssObj } from '@fuel-ui/css';
import { Box, Button, Tag, Text } from '@fuel-ui/react';
import type { Asset } from '@fuel-wallet/sdk';
import { useEffect, useState } from 'react';

import { ExampleBox } from '../../src/components/ExampleBox';
import { useFuel } from '../../src/hooks/useFuel';
import { useIsConnected } from '../../src/hooks/useIsConnected';
import { useLoading } from '../../src/hooks/useLoading';

export function Assets() {
  const [fuel, notDetected] = useFuel();
  const [assets, setAssets] = useState<Asset[]>();
  const [isConnected] = useIsConnected();
  const [handleAssets, errorAssets] = useLoading(async () => {
    const assets = await fuel.assets();
    setAssets(assets);
  });

  const [handleConnect, isConnecting, errorConnect] = useLoading(async () => {
    await fuel.connect();
  });

  /* eventAssets:start */
  const handleAssetsEvent = (assets: Asset[]) => {
    setAssets(assets);
  };

  useEffect(() => {
    fuel?.on(fuel.events.assets, handleAssetsEvent);
    return () => {
      fuel?.off(fuel.events.assets, handleAssetsEvent);
    };
  }, [fuel]);
  /* eventAssets:end */

  useEffect(() => {
    if (isConnected) handleAssets();
  }, [isConnected]);

  const errorMessage = errorAssets || notDetected || errorConnect;

  return (
    <ExampleBox error={errorMessage}>
      <Box.Stack css={styles.root}>
        <Box.Stack gap="$3" css={{ mt: '$2' }}>
          <Text> All wallet assets: </Text>
          {assets?.length ? (
            <>
              {assets.map((asset) => (
                <Tag size="xs" variant="ghost" key={asset.assetId}>
                  <Text key={asset.assetId}>
                    {asset.name} ({asset.symbol}): {asset.assetId}
                  </Text>
                </Tag>
              ))}
              <Text>
                <em>
                  Add / Edit / Remove assets in your Fuel wallet to test the
                  event.
                </em>
              </Text>
            </>
          ) : (
            <Text> No assets </Text>
          )}
          {!isConnected && (
            <Button
              onPress={handleConnect}
              isLoading={isConnecting}
              isDisabled={!fuel || isConnecting}
            >
              View your assets
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
    '.fuel_Tag': {
      justifyContent: 'flex-start',

      '& > p': {
        fontSize: '$sm',
      },
    },
  }),
};
