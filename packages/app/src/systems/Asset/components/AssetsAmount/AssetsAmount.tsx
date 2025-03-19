import {
  Avatar,
  Badge,
  Box,
  Copyable,
  Grid,
  Text,
  Tooltip,
  VStack,
} from '@fuel-ui/react';
import type { AssetFuelAmount } from '@fuel-wallet/types';
import { bn } from 'fuels';
import { type FC, useEffect, useMemo, useRef, useState } from 'react';
import { formatAmount, shortAddress } from '~/systems/Core';
import type { InsufficientInputAmountError } from '~/systems/Transaction';

import { useTruncation } from '~/systems/Core/hooks/useTruncation';
import { convertToUsd } from '~/systems/Core/utils/convertToUsd';
import { AssetsAmountLoader } from './AssetsAmountLoader';
import { styles } from './styles';

type GroupedError = {
  errorMessage?: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  error?: InsufficientInputAmountError | any;
};

export type AssetsAmountProps = {
  amounts: AssetFuelAmount[];
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
  const allEmptyAmounts = amounts.every((assetAmount) =>
    bn(assetAmount.amount).eq(0)
  );

  return (
    <>
      {(!allEmptyAmounts || hasError) && (
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
          {!allEmptyAmounts && (
            <Box.Stack gap="$2">
              {amounts.map(
                (assetAmount) =>
                  bn(assetAmount.amount).gt(0) && (
                    <AssetsAmountItem
                      assetAmount={assetAmount}
                      key={assetAmount.name}
                    />
                  )
              )}
            </Box.Stack>
          )}
        </Box>
      )}
    </>
  );
};

type AssetsAmountItemProps = {
  assetAmount: AssetFuelAmount;
};

const AssetsAmountItem = ({ assetAmount }: AssetsAmountItemProps) => {
  const {
    name = '',
    symbol,
    icon,
    assetId,
    decimals,
    amount,
    isNft,
    rate,
  } = assetAmount || {};
  const amountInUsd = useMemo(() => {
    if (amount == null || rate == null || decimals == null) return '$0';
    return convertToUsd(bn(amount), decimals, rate).formatted;
  }, [amount, rate, decimals]);

  const formatted = formatAmount({
    amount,
    options: { units: decimals || 0, precision: decimals || 0 },
  });

  const { ref: refAmount, open: openAmount } = useTruncation<HTMLSpanElement>();
  const { ref: refInUsd, open: openInUsd } = useTruncation<HTMLSpanElement>();

  return (
    <Grid key={assetId} css={styles.root}>
      <Box.Flex css={styles.asset}>
        {icon ? (
          <Avatar name={name} src={icon} />
        ) : (
          <Avatar.Generated hash={assetId} size="xsm" />
        )}
        <Text as="span" aria-label="Asset Name">
          {name || 'Unknown'}
        </Text>
        {isNft && (
          <Badge variant="ghost" intent="primary" css={styles.assetNft}>
            NFT
          </Badge>
        )}
      </Box.Flex>
      <Copyable value={assetId} css={styles.address}>
        <Text fontSize="xs" css={{ mt: '$1' }}>
          {shortAddress(assetId)}
        </Text>
      </Copyable>

      <Box.Flex aria-label="amount-container" css={styles.amountContainer}>
        <Tooltip content={formatted} delayDuration={0} open={openAmount}>
          <Text
            as="span"
            ref={refAmount}
            css={styles.amountValue}
            color="inherit"
          >
            {formatted}
          </Text>
        </Tooltip>
        <Text as="span" color="inherit" css={styles.amountSymbol}>
          {symbol}
        </Text>
      </Box.Flex>

      <Tooltip content={amountInUsd} delayDuration={0} open={openInUsd}>
        <Text as="span" ref={refInUsd} css={styles.amountInUsd}>
          {amountInUsd}
        </Text>
      </Tooltip>
    </Grid>
  );
};

AssetsAmount.Loader = AssetsAmountLoader;
