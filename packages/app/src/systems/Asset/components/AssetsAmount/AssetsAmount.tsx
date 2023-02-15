import { cssObj, cx } from '@fuel-ui/css';
import {
  Avatar,
  Card,
  Copyable,
  Flex,
  Grid,
  Stack,
  Text,
} from '@fuel-ui/react';
import type { AssetAmount } from '@fuel-wallet/types';
import { bn } from 'fuels';
import type { FC } from 'react';

import { AssetsAmountLoader } from './AssetsAmountLoader';

import { shortAddress } from '~/systems/Core';
import type { GroupedError } from '~/systems/Transaction';

export type AssetsAmountProps = {
  amounts: AssetAmount[];
  title?: string;
  isPositive?: boolean;
  isNegative?: boolean;
  balanceErrors?: GroupedError[];
};

type AssetsAmountComponent = FC<AssetsAmountProps> & {
  Loader: typeof AssetsAmountLoader;
};

export const AssetsAmount: AssetsAmountComponent = ({
  amounts,
  title,
  isPositive,
  isNegative,
  balanceErrors,
}: AssetsAmountProps) => {
  const hasError = !!balanceErrors?.length;

  return (
    <Card css={styles.card(hasError)}>
      {(title || hasError) && (
        <Flex css={styles.header}>
          {title && (
            <Text as="h3" css={{ fontSize: '$sm', fontWeight: '$semibold' }}>
              {title}
            </Text>
          )}
          {hasError && (
            <Text
              css={{
                color: '$red10',
                fontSize: '$sm',
                fontWeight: '$semibold',
              }}
            >
              (not enough balance)
            </Text>
          )}
        </Flex>
      )}
      <Stack gap="$2">
        {amounts.map((assetAmount) => (
          <AssetsAmountItem
            assetAmount={assetAmount}
            key={assetAmount.assetId}
            isPositive={isPositive}
            isNegative={isNegative}
          />
        ))}
      </Stack>
    </Card>
  );
};

type AssetsAmountItemProps = {
  assetAmount: AssetAmount;
  isPositive?: boolean;
  isNegative?: boolean;
};

const AssetsAmountItem = ({
  assetAmount,
  isPositive,
  isNegative,
}: AssetsAmountItemProps) => {
  const assetAmountClass = cx('asset_amount');

  const {
    name = '',
    symbol = '',
    imageUrl = '',
    assetId,
    amount,
  } = assetAmount || {};

  return (
    <Grid key={assetId} css={styles.root} className={assetAmountClass}>
      <Flex css={styles.asset}>
        <Avatar name={name} src={imageUrl} css={{ height: 18, width: 18 }} />
        <Text as="span">{name}</Text>
      </Flex>
      <Copyable value={assetId} css={styles.address}>
        <Text fontSize="xs" css={{ mt: '$1' }}>
          {shortAddress(assetId)}
        </Text>
      </Copyable>
      <Flex css={styles.amount(isPositive)}>
        {isPositive && '+'}
        {isNegative && '-'}
        {bn(amount).format()} {symbol}
      </Flex>
    </Grid>
  );
};

const styles = {
  card: (isError?: boolean) =>
    cssObj({
      px: '$3',
      py: '$2',
      ...(isError && {
        backgroundColor: '$red3',
      }),
    }),
  header: cssObj({
    mb: '$3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }),
  root: cssObj({
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'repeat(2, 1fr)',
    fontWeight: '$semibold',
    color: '$gray12',

    '& ~ & ': {
      pt: '$2',
      borderTop: '1px dashed $gray3',
    },
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
  amount: (isPositive?: boolean) =>
    cssObj({
      justifyContent: 'flex-end',
      gridRow: '1 / 3',
      gridColumn: '2 / 3',
      textAlign: 'right',
      fontSize: '$sm',
      color: isPositive ? '$accent11' : '$gray12',
      alignItems: 'center',
    }),
};

AssetsAmount.Loader = AssetsAmountLoader;
