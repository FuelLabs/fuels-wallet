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
import { type FC, useEffect, useRef, useState } from 'react';
import { formatAmount, shortAddress } from '~/systems/Core';
import type { InsufficientInputAmountError } from '~/systems/Transaction';

import { convertAsset } from '~/systems/Asset/services/convert-asset';
import { useProvider } from '~/systems/Network/hooks/useProvider';
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
  const [amountInUsd, setAmountInUsd] = useState<string>('$0.00');
  const provider = useProvider();
  const {
    name = '',
    symbol,
    icon,
    assetId,
    decimals,
    amount,
    isNft,
  } = assetAmount || {};

  const containerRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const formatted = formatAmount({
    amount,
    options: { units: decimals || 0, precision: decimals || 0 },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (containerRef.current) {
      const amountElement = containerRef.current.querySelector('.amount-value');
      if (amountElement) {
        setIsTruncated(amountElement.scrollWidth > amountElement.clientWidth);
      }
    }
  }, [formatted]);

  useEffect(() => {
    let abort = false;
    async function loadAndStoreRate() {
      if (amount != null && !isNft) {
        const chainId = await provider?.getChainId();
        const baseAssetId = await provider?.getBaseAssetId();
        if (chainId == null) return;
        if (baseAssetId == null) return;
        if (abort) return;
        const res = await convertAsset(chainId, assetId, amount.toString());
        if (!abort) setAmountInUsd(res?.amount || '$0.00');
      }
    }
    loadAndStoreRate();
    return () => {
      abort = true;
    };
  }, [amount, assetId, isNft, provider]);

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

      <Box.Flex
        ref={containerRef}
        aria-label="amount-container"
        css={styles.amountContainer}
      >
        <Tooltip
          content={formatted}
          delayDuration={0}
          open={isTruncated ? undefined : false}
        >
          <Text as="span" css={styles.amountValue} className="amount-value">
            {formatted}
            <Text as="span" css={styles.amountSymbol}>
              {symbol}
            </Text>
          </Text>
        </Tooltip>
        <Text as="span" css={styles.amountInUsd}>
          {amountInUsd}
        </Text>
      </Box.Flex>
    </Grid>
  );
};

AssetsAmount.Loader = AssetsAmountLoader;
