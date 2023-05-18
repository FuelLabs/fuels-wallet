/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import {
  Box,
  Stack,
  Button,
  Input,
  Flex,
  Text,
  IconButton,
  Icon,
} from '@fuel-ui/react';
import { useState } from 'react';

import type { Asset } from '~/../types/src';
import { ExampleBox } from '~/src/components/ExampleBox';
import { useFuel } from '~/src/hooks/useFuel';
import { useIsConnected } from '~/src/hooks/useIsConnected';
import { useLoading } from '~/src/hooks/useLoading';

export function AddAssets() {
  const [fuel, notDetected] = useFuel();
  const [isConnected] = useIsConnected();
  const [assets, setAssets] = useState<Asset[]>([
    {
      assetId:
        '0x566012155ae253353c7df01f36c8f6249c94131a69a3484bdb0234e3822b5d90',
      name: 'New',
      symbol: 'NEW',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
      isCustom: true,
    },
  ]);

  const [handleAddAsset, isSingingMessage, errorSigningMessage] = useLoading(
    async (assets: Asset[]) => {
      console.log('Add Assets', assets);
      /* example:start */
      await fuel.addAssets(assets);
      /* example:end */
    }
  );

  const errorMessage = notDetected || errorSigningMessage;

  const onChangeAsset = (index: number, asset: Asset) => {
    const newAssets = [...assets];
    newAssets[index] = asset;
    setAssets(newAssets);
  };

  const removeAsset = (index: number) => () => {
    const newAssets = [...assets];
    newAssets.splice(index, 1);
    setAssets(newAssets);
  };

  return (
    <ExampleBox error={errorMessage}>
      <Stack css={styles.wrapper}>
        {assets.map((asset, index) => {
          const isLast = index === assets.length - 1;

          return (
            <Stack key={asset.assetId + index} css={styles.item(isLast)}>
              <Flex css={styles.itemHeader}>
                <Text>Asset {index + 1}</Text>
                {!!index && (
                  <IconButton
                    size="xs"
                    variant="ghost"
                    color="yellow"
                    icon={<Icon icon="X" />}
                    onPress={removeAsset(index)}
                    aria-label="Remove Asset"
                  />
                )}
              </Flex>
              <Input isDisabled={!isConnected} css={styles.input}>
                <Input.Field
                  defaultValue={asset.assetId}
                  onBlur={(e) =>
                    onChangeAsset(index, { ...asset, assetId: e.target.value })
                  }
                  placeholder="Type your assetId (0x...)"
                />
              </Input>
              <Flex gap="$2">
                <Input isDisabled={!isConnected} css={styles.input}>
                  <Input.Field
                    defaultValue={asset.name}
                    onBlur={(e) =>
                      onChangeAsset(index, { ...asset, name: e.target.value })
                    }
                    placeholder="Type your asset Name"
                  />
                </Input>
                <Input isDisabled={!isConnected} css={styles.input}>
                  <Input.Field
                    defaultValue={asset.symbol}
                    onBlur={(e) =>
                      onChangeAsset(index, { ...asset, symbol: e.target.value })
                    }
                    placeholder="Type your asset Symbol"
                  />
                </Input>
              </Flex>
              <Input isDisabled={!isConnected} css={styles.input}>
                <Input.Field
                  defaultValue={asset.imageUrl}
                  onBlur={(e) =>
                    onChangeAsset(index, { ...asset, imageUrl: e.target.value })
                  }
                  placeholder="Type your asset imageUrl"
                />
              </Input>
            </Stack>
          );
        })}
        <Button
          variant="link"
          css={{ alignSelf: 'center' }}
          onPress={() =>
            setAssets([
              ...assets,
              { assetId: '', name: '', symbol: '', imageUrl: '' },
            ])
          }
        >
          Add another asset
        </Button>
        <Box>
          <Button
            onPress={() => handleAddAsset(assets)}
            isLoading={isSingingMessage}
            isDisabled={isSingingMessage || !isConnected}
          >
            Add Assets
          </Button>
        </Box>
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
