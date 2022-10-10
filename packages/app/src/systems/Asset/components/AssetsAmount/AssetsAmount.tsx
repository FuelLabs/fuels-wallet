import { cssObj } from '@fuel-ui/css';
import { Avatar, Card, Copyable, Flex, Grid, Text } from '@fuel-ui/react';

import type { Asset } from '../../types';
import { getAssetInfoById } from '../../utils';

import { formatUnits, shortAddress } from '~/systems/Core';

export type AssetsAmountProps = {
  amounts: Asset[];
};

export function AssetsAmount({ amounts }: AssetsAmountProps) {
  return (
    <Card css={styles.card}>
      {amounts.map((item) => {
        const asset = getAssetInfoById(item.assetId, item);
        const isPositive = (asset?.amount ?? 0) > 0;
        return (
          <Grid key={asset.assetId} css={styles.root}>
            <Flex css={styles.asset}>
              <Avatar
                name={asset.name}
                src={asset.imageUrl}
                css={{ height: 18, width: 18 }}
              />
              <Text as="span">{asset.name}</Text>
            </Flex>
            <Copyable value={asset.assetId} css={styles.address}>
              {shortAddress(asset.assetId)}
            </Copyable>
            <Flex css={styles.amount(isPositive)}>
              {isPositive ? '+' : ''}
              {formatUnits(asset.amount)} {asset.symbol}
            </Flex>
          </Grid>
        );
      })}
    </Card>
  );
}

const styles = {
  card: cssObj({
    px: '$3',
    py: '$2',
    flexDirection: 'column',
    gap: '$2',
  }),
  root: cssObj({
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'repeat(2, 1fr)',
    fontWeight: '$semibold',
    color: '$gray12',
  }),
  asset: cssObj({
    alignItems: 'center',
    gap: '$2',

    '& span': {
      fontSize: '$sm',
      color: '$gray12',
    },
  }),
  address: cssObj({
    gridColumn: '1 / 2',
    color: '$gray9',
    fontSize: '$xs',
  }),
  amount: (isPositive: boolean) =>
    cssObj({
      justifyContent: 'flex-end',
      gridRow: '1 / 3',
      gridColumn: '2 / 3',
      textAlign: 'right',
      fontSize: '$sm',
      color: isPositive ? '$accent11' : '$gray11',
    }),
};
