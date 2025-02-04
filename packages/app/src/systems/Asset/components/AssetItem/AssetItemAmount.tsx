import { cssObj } from '@fuel-ui/css';
import { Box, Text, Tooltip, VStack } from '@fuel-ui/react';
import { type BNInput, bn } from 'fuels';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AmountVisibility, formatBalance } from '~/systems/Core';
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

  const amountRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const open = useMemo<boolean | undefined>(() => {
    if (visibility && (tooltip || isTruncated)) return undefined;
    return false;
  }, [tooltip, visibility, isTruncated]);

  const amountInUsd = useMemo(() => {
    if (amount == null || rate == null || decimals == null) return '$0';
    return convertToUsd(bn(amount), decimals, rate).formatted;
  }, [amount, rate, decimals]);

  useEffect(() => {
    if (!tooltip && amountRef.current) {
      const amountEl = amountRef.current;
      setIsTruncated(amountEl.scrollWidth > amountEl.clientWidth);
    }
  }, [tooltip]);

  return (
    <Tooltip content={original.display} delayDuration={0} open={open}>
      <Box css={styles.root}>
        <VStack gap="0">
          <Text
            as="span"
            ref={amountRef}
            css={styles.amount}
            aria-label={`${symbol} token balance`}
          >
            <AmountVisibility
              value={amount}
              units={decimals}
              visibility={visibility}
            />
            <Text as="span" css={styles.symbol}>
              {symbol}
            </Text>
          </Text>
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
      </Box>
    </Tooltip>
  );
};

const styles = {
  root: cssObj({
    display: 'inline-flex',
    columnGap: '$1',
    minWidth: 0,
    alignItems: 'center',
    flexWrap: 'nowrap',
    textSize: 'base',
    fontWeight: '$normal',
    textAlign: 'right',
    paddingLeft: '$2',
    lineHeight: '24px',
  }),
  amount: cssObj({
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
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
