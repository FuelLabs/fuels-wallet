import { cssObj } from '@fuel-ui/css';
import { Avatar, CardList, Flex, Heading, Text } from '@fuel-ui/react';
import type { Coin } from '@fuels-wallet/types';
import type { FC } from 'react';

import { getAssetInfoById } from '../../utils';

import { AssetItemLoader } from './AssetItemLoader';

import { formatUnits } from '~/systems/Core';

export type AssetItemProps = {
  asset: Coin;
};

type AssetItemComponent = FC<AssetItemProps> & {
  Loader: typeof AssetItemLoader;
};

export const AssetItem: AssetItemComponent = ({ asset }) => {
  const { symbol, name, imageUrl } = getAssetInfoById(asset.assetId, asset);

  const rightEl = (
    <Text css={{ fontSize: '$sm', fontWeight: '$semibold' }}>
      {formatUnits(asset.amount)} {symbol}
    </Text>
  );

  return (
    <CardList.Item
      rightEl={rightEl}
      css={{ alignItems: 'center', py: '$2', px: '$3' }}
    >
      <Avatar name={name} src={imageUrl} css={{ height: 36, width: 36 }} />
      <Flex direction="column">
        <Heading as="h6" css={styles.assetName}>
          {name}
        </Heading>
        <Text css={styles.assetSymbol}>{symbol}</Text>
      </Flex>
    </CardList.Item>
  );
};

AssetItem.Loader = AssetItemLoader;

const styles = {
  assetName: cssObj({
    margin: 0,
    fontSize: '$sm',
  }),
  assetSymbol: cssObj({
    textSize: 'sm',
    fontWeight: '$semibold',
  }),
};
