import { cssObj } from '@fuel-ui/css';
import { Box, Button, Icon, IconButton, Input, Text } from '@fuel-ui/react';
import {
  useAddAssets,
  useConnect,
  useFuel,
  useIsConnected,
} from '@fuels/react';
import type { Asset, AssetFuel } from 'fuels';
import { useState } from 'react';

import { ExampleBox } from '../../../src/components/ExampleBox';
import { getAssetByChain } from '../../../src/utils/getAssetByChain';
import { ASSET } from '../data';

export function AddAssetsHook() {
  const { fuel } = useFuel();
  const { isConnected } = useIsConnected();
  const [assets, setAssets] = useState<Asset[]>([ASSET]);
  const { connect, error: errorConnecting } = useConnect();
  /* addAssets:start */
  const { addAssets, isPending, error } = useAddAssets();

  async function handleAddAssets(assets: Asset[]) {
    if (!isConnected) await connect(undefined); // ignore-line
    console.log('Add Assets', assets);
    addAssets(assets);
  }
  /* addAssets:end */

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
    <ExampleBox error={error || errorConnecting}>
      <Box.Stack css={styles.wrapper}>
        {assets.map((asset, index) => {
          const isLast = index === assets.length - 1;
          const assetData = getAssetByChain(asset, 0);

          return (
            <Box.Stack
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={(assetData?.name || '') + index}
              css={styles.item(isLast)}
            >
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
                  defaultValue={assetData?.assetId}
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
                    defaultValue={assetData?.decimals}
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
            onPress={() => handleAddAssets(assets)}
            isLoading={isPending}
            isDisabled={isPending || !fuel}
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
