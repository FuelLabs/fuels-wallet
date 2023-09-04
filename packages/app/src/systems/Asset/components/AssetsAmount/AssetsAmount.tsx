import { cx } from '@fuel-ui/css';
import { Avatar, Box, Copyable, Grid, Text } from '@fuel-ui/react';
import type { AssetAmount } from '@fuel-wallet/types';
import { bn } from 'fuels';
import type { FC } from 'react';
import { shortAddress } from '~/systems/Core';
import type { GroupedError } from '~/systems/Transaction';

import { AssetsAmountLoader } from './AssetsAmountLoader';
import { styles } from './styles';

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
    <Box css={styles.card} data-error={hasError}>
      {(title || hasError) && (
        <Box.Flex css={styles.header}>
          {title && (
            <Text as="h3" css={styles.title}>
              {title}
            </Text>
          )}
          {hasError && (
            <Text
              css={{
                color: '$intentsError10',
                fontSize: '$sm',
                fontWeight: '$normal',
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
    </Box>
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

AssetsAmount.Loader = AssetsAmountLoader;
