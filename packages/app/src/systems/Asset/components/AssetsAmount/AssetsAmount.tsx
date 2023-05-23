import { cssObj, cx } from '@fuel-ui/css';
import { Avatar, Box, Card, Copyable, Grid, Text } from '@fuel-ui/react';
import type { AssetAmount } from '@fuel-wallet/types';
import { bn } from 'fuels';
import type { FC } from 'react';

import { AssetsAmountLoader } from './AssetsAmountLoader';

import { shortAddress } from '~/systems/Core';
import type { GroupedError } from '~/systems/Transaction';

export type AssetsAmountProps = {
  amounts: AssetAmount[];
  title?: string;
  balanceErrors?: GroupedError[];
};

type AssetsAmountComponent = FC<AssetsAmountProps> & {
  Loader: typeof AssetsAmountLoader;
};

export const AssetsAmount: AssetsAmountComponent = ({
  amounts,
  title,
  balanceErrors,
}: AssetsAmountProps) => {
  const hasError = !!balanceErrors?.length;

  return (
    <Card css={styles.card} data-error={hasError}>
      {(title || hasError) && (
        <Box.Flex css={styles.header}>
          {title && (
            <Text as="h3" css={{ fontSize: '$sm', fontWeight: '$semibold' }}>
              {title}
            </Text>
          )}
          {hasError && (
            <Text
              css={{
                color: '$intentsError10',
                fontSize: '$sm',
                fontWeight: '$semibold',
              }}
            >
              (not enough balance)
            </Text>
          )}
        </Box.Flex>
      )}
      <Box.Stack gap="$2">
        {amounts.map((assetAmount) => (
          <AssetsAmountItem
            assetAmount={assetAmount}
            key={assetAmount.assetId}
          />
        ))}
      </Box.Stack>
    </Card>
  );
};

type AssetsAmountItemProps = {
  assetAmount: AssetAmount;
};

const AssetsAmountItem = ({ assetAmount }: AssetsAmountItemProps) => {
  const assetAmountClass = cx('asset_amount');
  const { name = '', symbol, imageUrl, assetId, amount } = assetAmount || {};

  return (
    <Grid key={assetId} css={styles.root} className={assetAmountClass}>
      <Box.Flex css={styles.asset}>
        {imageUrl ? (
          <Avatar name={name} src={imageUrl} />
        ) : (
          <Avatar.Generated hash={assetId} size="xsm" />
        )}
        <Text as="span">{name || 'Unknown'}</Text>
      </Box.Flex>
      <Copyable value={assetId} css={styles.address}>
        <Text fontSize="xs" css={{ mt: '$1' }}>
          {shortAddress(assetId)}
        </Text>
      </Copyable>
      <Box.Flex css={styles.amount}>
        {bn(amount).format()} {symbol}
      </Box.Flex>
    </Grid>
  );
};

const styles = {
  card: cssObj({
    px: '$3',
    py: '$2',

    '&[data-error=true]': {
      backgroundColor: '$intentsError3',
    },

    '.fuel_Avatar': {
      width: '$5',
      height: '$5',
    },
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
    color: '$intentsBase12',

    '& ~ & ': {
      pt: '$2',
      borderTop: '1px solid $border',
    },
  }),
  asset: cssObj({
    alignItems: 'center',
    gap: '$2',

    '& span': {
      fontSize: '$sm',
      color: '$intentsBase12',
    },
  }),
  address: cssObj({
    gridColumn: '1 / 2',
    color: '$intentsBase9',
    fontSize: '$sm',
  }),
  amount: cssObj({
    justifyContent: 'flex-end',
    gridRow: '1 / 3',
    gridColumn: '2 / 3',
    textAlign: 'right',
    fontSize: '$sm',
    color: '$intentsBase12',
    alignItems: 'center',
  }),
};

AssetsAmount.Loader = AssetsAmountLoader;
