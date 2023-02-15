/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Box, Stack, Button, Input, Tag } from '@fuel-ui/react';
import { useState } from 'react';

import { MOCK_CUSTOM_ASSET } from '~/../app/src/systems/Asset/__mocks__/assets';
import type { Asset } from '~/../types/src';
import { ExampleBox } from '~/src/components/ExampleBox';
import { useFuel } from '~/src/hooks/useFuel';
import { useIsConnected } from '~/src/hooks/useIsConnected';
import { useLoading } from '~/src/hooks/useLoading';

export function AddAsset() {
  const [fuel, notDetected] = useFuel();
  const [isConnected] = useIsConnected();
  const [addedAsset, setAddedAsset] = useState<Asset>();
  const [asset, setAsset] = useState<Asset>(MOCK_CUSTOM_ASSET);

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
      <Stack css={styles.wrapper}>
        <Input isDisabled={!isConnected} css={styles.input}>
          <Input.Field
            value={asset.assetId}
            onChange={(e) => setAsset({ ...asset, assetId: e.target.value })}
            placeholder="Type your assetId (0x...)"
          />
        </Input>
        <Input isDisabled={!isConnected} css={styles.input}>
          <Input.Field
            value={asset.name}
            onChange={(e) => setAsset({ ...asset, name: e.target.value })}
            placeholder="Type your asset Name"
          />
        </Input>
        <Input isDisabled={!isConnected} css={styles.input}>
          <Input.Field
            value={asset.symbol}
            onChange={(e) => setAsset({ ...asset, symbol: e.target.value })}
            placeholder="Type your asset Symbol"
          />
        </Input>
        <Input isDisabled={!isConnected} css={styles.input}>
          <Input.Field
            value={asset.imageUrl}
            onChange={(e) => setAsset({ ...asset, imageUrl: e.target.value })}
            placeholder="Type your asset imageUrl"
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
  wrapper: cssObj({
    gap: '$4',
  }),
  input: cssObj({
    width: '100%',
  }),
};
