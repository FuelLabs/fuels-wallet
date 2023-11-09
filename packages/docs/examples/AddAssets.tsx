/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Box, Button, Input, Text, IconButton, Icon } from '@fuel-ui/react';
import type { AssetFuel, Asset } from '@fuel-wallet/sdk';
import { getAssetByChain } from '@fuel-wallet/sdk';
import { useState } from 'react';

import { ExampleBox } from '../src/components/ExampleBox';
import { useFuel } from '../src/hooks/useFuel';
import { useIsConnected } from '../src/hooks/useIsConnected';
import { useLoading } from '../src/hooks/useLoading';

export function AddAssets() {
  const [fuel, notDetected] = useFuel();
  const [isConnected] = useIsConnected();
  const [assets, setAssets] = useState<Asset[]>([
    {
      name: 'New',
      symbol: 'NEW',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
      networks: [
        {
          type: 'fuel',
          chainId: 0,
          decimals: 6,
          assetId:
            '0x566012155ae253353c7df01f36c8f6249c94131a69a3484bdb0234e3822b5d90',
        },
      ],
    },
  ]);

  const [handleAddAsset, isSingingMessage, errorSigningMessage] = useLoading(
    async (assets: Asset[]) => {
      if (!isConnected) await fuel.connect();
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
      <Box.Stack css={styles.wrapper}>
        {assets.map((a, index) => {
          const isLast = index === assets.length - 1;
          const asset = getAssetByChain(a, 0);

          return (
            <Box.Stack key={asset.assetId + index} css={styles.item(isLast)}>
              <Box.Flex css={styles.itemHeader}>
                <Text>Asset {index + 1}</Text>
                {!!index && (
                  <IconButton
                    size="xs"
                    variant="ghost"
                    intent="warning"
                    icon={<Icon icon="X" />}
                    onPress={removeAsset(index)}
                    aria-label="Remove Asset"
                  />
                )}
              </Box.Flex>
              <Input isDisabled={!fuel} css={styles.input}>
                <Input.Field
                  defaultValue={asset.assetId}
                  onBlur={(e) =>
                    onChangeAsset(index, {
                      ...asset,
                      networks: [
                        {
                          ...(asset.networks[0] as AssetFuel),
                          assetId: e.target.value,
                        },
                      ],
                    })
                  }
                  placeholder="Type your assetId (0x...)"
                />
              </Input>
              <Box.Flex gap="$2">
                <Input isDisabled={!fuel} css={styles.input}>
                  <Input.Field
                    defaultValue={asset.name}
                    onBlur={(e) =>
                      onChangeAsset(index, { ...asset, name: e.target.value })
                    }
                    placeholder="Type your asset Name"
                  />
                </Input>
                <Input isDisabled={!fuel} css={styles.input}>
                  <Input.Field
                    defaultValue={asset.symbol}
                    onBlur={(e) =>
                      onChangeAsset(index, { ...asset, symbol: e.target.value })
                    }
                    placeholder="Type your asset Symbol"
                  />
                </Input>
                <Input isDisabled={!fuel} css={styles.input}>
                  <Input.Field
                    type="number"
                    defaultValue={asset.decimals}
                    onBlur={(e) => {
                      onChangeAsset(index, {
                        ...asset,
                        networks: [
                          {
                            ...(asset.networks[0] as AssetFuel),
                            decimals: Number(e.target.value || 0),
                          },
                        ],
                      });
                    }}
                    placeholder="Type your asset Decimals"
                  />
                </Input>
              </Box.Flex>
              <Input isDisabled={!fuel} css={styles.input}>
                <Input.Field
                  defaultValue={asset.icon}
                  onBlur={(e) =>
                    onChangeAsset(index, { ...asset, icon: e.target.value })
                  }
                  placeholder="Type your asset imageUrl"
                />
              </Input>
            </Box.Stack>
          );
        })}
        <Button
          variant="link"
          css={{ alignSelf: 'center' }}
          onPress={() =>
            setAssets([
              ...assets,
              {
                name: '',
                symbol: '',
                icon: '',
                networks: [
                  {
                    type: 'fuel',
                    chainId: 0,
                    assetId: '',
                    decimals: 0,
                  },
                ],
              },
            ])
          }
        >
          Add another asset
        </Button>
        <Box>
          <Button
            onPress={() => handleAddAsset(assets)}
            isLoading={isSingingMessage}
            isDisabled={isSingingMessage || !fuel}
          >
            Add Assets
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
