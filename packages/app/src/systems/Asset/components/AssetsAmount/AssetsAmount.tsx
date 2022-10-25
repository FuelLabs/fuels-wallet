import { cssObj } from '@fuel-ui/css';
import { Avatar, Card, Copyable, Flex, Grid, Text } from '@fuel-ui/react';
import { bn } from 'fuels';

import type { Asset } from '../../types';
import { getAssetInfoById } from '../../utils';

import { MAX_FRACTION_DIGITS } from '~/config';
import { shortAddress } from '~/systems/Core';
import type { TxInputCoin, TxOutputCoin } from '~/systems/Transaction';

export type AssetsAmountProps = {
  amounts: Asset[] | TxOutputCoin[] | TxInputCoin[];
  title?: string;
};

export function AssetsAmount({ amounts, title }: AssetsAmountProps) {
  return (
    <Card css={styles.card}>
      <Text as="h3" css={{ fontSize: '$sm', fontWeight: '$semibold' }}>
        {title}
      </Text>
      {amounts.map((item, i) => {
        const asset = getAssetInfoById(item.assetId, item);
        const amount = bn(asset.amount);
        const isLast = i === amounts.length - 1;

        return (
          <Grid key={asset.assetId.toString()} css={styles.root(isLast)}>
            <Flex css={styles.asset}>
              <Avatar
                name={asset.name}
                src={asset.imageUrl}
                css={{ height: 18, width: 18 }}
              />
              <Text as="span">{asset.name}</Text>
            </Flex>
            <Copyable value={asset.assetId} css={styles.address}>
              <Text fontSize="xs" css={{ mt: '$1' }}>
                {shortAddress(asset.assetId)}
              </Text>
            </Copyable>
            <Flex css={styles.amount(false)}>
              {amount.formatUnits(MAX_FRACTION_DIGITS)} {asset.symbol}
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
  root: (isLast: boolean) =>
    cssObj({
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridTemplateRows: 'repeat(2, 1fr)',
      fontWeight: '$semibold',
      color: '$gray12',
      borderBottom: isLast ? 'none' : '1px dashed $gray3',
      pb: '$2',
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
      color: isPositive ? '$accent11' : '$gray12',
      alignItems: 'center',
      '&:before': {
        content: isPositive ? "'+'" : "'-'",
      },
    }),
};
