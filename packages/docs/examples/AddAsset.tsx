/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Box, Stack, Button, Input, Tag } from '@fuel-ui/react';
import { useState } from 'react';

import type { Asset } from '~/../types/src';
import { ExampleBox } from '~/src/components/ExampleBox';
import { useFuel } from '~/src/hooks/useFuel';
import { useIsConnected } from '~/src/hooks/useIsConnected';
import { useLoading } from '~/src/hooks/useLoading';

export function AddAsset() {
  const [fuel, notDetected] = useFuel();
  const [isConnected] = useIsConnected();
  const [addedAsset, setAddedAsset] = useState<Asset>();
  const [asset, setAsset] = useState<Asset>({
    name: 'New',
    symbol: 'NEW',
    assetId:
      '0x566012155ae253353c7df01f36c8f6249c94131a69a3484bdb0234e3822b5d90',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
  });

  const [handleAddAsset, isSingingMessage, errorSigningMessage] = useLoading(
    async (asset: Asset) => {
      console.debug('Add Asset', asset);
      /* example:start */
      const addedAsset = await fuel.addAsset(asset);
      console.debug('Added Asset', addedAsset);
      /* example:end */
      setAddedAsset(addedAsset);
    }
  );

  const errorMessage = notDetected || errorSigningMessage;

  return (
    <ExampleBox error={errorMessage}>
      <Stack css={{ gap: '$4' }}>
        <Input isDisabled={!isConnected} css={{ width: '100%' }}>
          <Input.Field
            value={asset.assetId}
            onChange={(e) => setAsset({ ...asset, assetId: e.target.value })}
            placeholder="Type your assetId (0x...)"
            // css={{ color: '$whiteA11', padding: '$2' }}
          />
        </Input>
        <Input isDisabled={!isConnected} css={{ width: '100%' }}>
          <Input.Field
            value={asset.name}
            onChange={(e) => setAsset({ ...asset, name: e.target.value })}
            placeholder="Type your asset Name"
            // css={{ color: '$whiteA11', padding: '$2' }}
          />
        </Input>
        <Input isDisabled={!isConnected} css={{ width: '100%' }}>
          <Input.Field
            value={asset.symbol}
            onChange={(e) => setAsset({ ...asset, symbol: e.target.value })}
            placeholder="Type your asset Symbol"
            // css={{ color: '$whiteA11', padding: '$2' }}
          />
        </Input>
        <Input isDisabled={!isConnected} css={{ width: '100%' }}>
          <Input.Field
            value={asset.imageUrl}
            onChange={(e) => setAsset({ ...asset, imageUrl: e.target.value })}
            placeholder="Type your asset imageUrl"
            // css={{ color: '$whiteA11', padding: '$2' }}
          />
        </Input>
        <Box>
          <Button
            onPress={() => handleAddAsset(asset)}
            isLoading={isSingingMessage}
            isDisabled={isSingingMessage || !isConnected}
          >
            Add Asset
          </Button>
        </Box>
        {addedAsset && (
          <Tag size="xs" color="gray" variant="ghost" css={styles.msg}>
            {JSON.stringify(addedAsset)}
          </Tag>
        )}
      </Stack>
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
};
