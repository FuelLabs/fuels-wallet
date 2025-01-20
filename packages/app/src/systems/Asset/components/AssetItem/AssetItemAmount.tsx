import { cssObj } from '@fuel-ui/css';
import { Box, Text, Tooltip, VStack } from '@fuel-ui/react';
import type { BNInput } from 'fuels';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AmountVisibility, formatBalance } from '~/systems/Core';
import { useBalanceVisibility } from '~/systems/Core/hooks/useVisibility';

type AssetItemAmountProps = {
  amount: BNInput;
  decimals: number | undefined;
  symbol: string | undefined;
  convertedRate: string | undefined;
};

export const AssetItemAmount = ({
  amount,
  decimals,
  symbol,
  convertedRate,
}: AssetItemAmountProps) => {
  const { visibility } = useBalanceVisibility();
  const { original, tooltip } = formatBalance(amount, decimals);

  const amountRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const open = useMemo<boolean | undefined>(() => {
    if (visibility && (tooltip || isTruncated)) return undefined;
    return false;
  }, [tooltip, visibility, isTruncated]);

  useEffect(() => {
    if (!tooltip && amountRef.current) {
      const amountEl = amountRef.current;
      setIsTruncated(amountEl.scrollWidth > amountEl.clientWidth);
    }
  }, [tooltip]);

  return (
    <Tooltip content={original.display} delayDuration={0} open={open}>
      <Box css={styles.root}>
        <VStack gap="$1">
          <Text as="span" ref={amountRef} css={styles.amount}>
            <AmountVisibility
              value={amount}
              units={decimals}
              visibility={visibility}
            />
            <Text as="span" css={styles.symbol}>
              {symbol}
            </Text>
          </Text>
          <Text
            aria-hidden={visibility}
            aria-label={`${symbol} conversion rate to USD`}
            className="text-start text-sm"
          >
            {visibility ? (convertedRate ?? '$0.00') : '•••••'}
          </Text>
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
    fontSize: '$sm',
    fontWeight: '$normal',
    textAlign: 'right',
    paddingLeft: '$2',
  }),
  amount: cssObj({
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
  symbol: cssObj({
    flexShrink: 0,
  }),
};
