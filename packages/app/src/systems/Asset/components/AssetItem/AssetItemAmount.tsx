import { cssObj } from '@fuel-ui/css';
import { Box, Text, Tooltip, VStack } from '@fuel-ui/react';
import { type BNInput, bn } from 'fuels';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AmountVisibility, formatBalance } from '~/systems/Core';
import { useTruncation } from '~/systems/Core/hooks/useTruncation';
import { useBalanceVisibility } from '~/systems/Core/hooks/useVisibility';
import { convertToUsd } from '~/systems/Core/utils/convertToUsd';

type AssetItemAmountProps = {
  amount: BNInput;
  decimals: number | undefined;
  symbol: string | undefined;
  rate: number | undefined;
};

export const AssetItemAmount = ({
  amount,
  decimals,
  symbol,
  rate,
}: AssetItemAmountProps) => {
  const { visibility } = useBalanceVisibility();
  const { original, tooltip } = formatBalance(amount, decimals);

  const { ref, isTruncated } = useTruncation<HTMLSpanElement>();

  const open = useMemo<boolean | undefined>(() => {
    if (visibility && (tooltip || isTruncated)) return undefined;
    return false;
  }, [tooltip, visibility, isTruncated]);

  const amountInUsd = useMemo(() => {
    if (amount == null || rate == null || decimals == null) return '$0';
    return convertToUsd(bn(amount), decimals, rate).formatted;
  }, [amount, rate, decimals]);

  return (
    <Tooltip content={original.display} delayDuration={0} open={open}>
      <VStack gap="0" align="flex-end" css={styles.container}>
        <Box css={styles.balanceRow} aria-label={`${symbol} token balance`}>
          <Text as="span" ref={ref} css={styles.amount}>
            <AmountVisibility
              value={amount}
              units={decimals}
              visibility={visibility}
            />
          </Text>
          <Text as="span" css={styles.symbol}>
            {symbol}
          </Text>
        </Box>
        {!!amountInUsd && amountInUsd !== '$0' && (
          <Text
            aria-hidden={visibility}
            aria-label={`${symbol} conversion rate to USD`}
            css={styles.amountInUsd}
          >
            {visibility ? amountInUsd : '$••••'}
          </Text>
        )}
      </VStack>
    </Tooltip>
  );
};

const styles = {
  container: cssObj({
    minWidth: 0,
  }),
  balanceRow: cssObj({
    display: 'inline-flex',
    columnGap: '$1',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'nowrap',
    textSize: 'base',
    fontWeight: '$normal',
    textAlign: 'right',
    lineHeight: '24px',
  }),
  amount: cssObj({
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: '$textHeading',
  }),
  symbol: cssObj({
    flexShrink: 0,
    color: '$textHeading',
  }),
  amountInUsd: cssObj({
    textSize: 'sm',
    fontWeight: '$normal',
    textAlign: 'right',
    color: '$primary',
  }),
};
