import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
import { useAsset } from '~/systems/Asset';
import { formatAmount, shortAddress } from '~/systems/Core';

type TxAssetAmountProps = {
  amount: string;
  assetId?: string;
  showIcon?: boolean;
  showSymbol?: boolean;
  showAssetId?: boolean;
  showLabel?: boolean;
  label?: string;
};

export function TxAssetAmount({
  amount,
  assetId,
  showIcon = true,
  showSymbol = true,
  showAssetId = true,
  showLabel = true,
  label,
}: TxAssetAmountProps) {
  const asset = useAsset(assetId);

  return (
    <Box.Stack gap="$0" css={styles.root}>
      {showLabel && label && (
        <Text css={{ color: '$blue9' }} fontSize="sm">
          {label}
        </Text>
      )}
      <Box.Flex css={styles.content}>
        {showIcon && <Icon icon="Coins" size={14} />}
        <Text fontSize="sm">
          {formatAmount({
            amount,
            options: { units: 9 }, // Default to 9 decimals for ETH
          })}
          {showSymbol && asset && (
            <Text as="span" css={styles.symbol}>
              {' '}
              {asset.symbol || 'Unknown'}
            </Text>
          )}
          {showAssetId && assetId && (
            <Text as="span" css={styles.assetId}>
              {' '}
              ({shortAddress(assetId)})
            </Text>
          )}
        </Text>
      </Box.Flex>
    </Box.Stack>
  );
}

const styles = {
  root: cssObj({
    display: 'flex',
    flexDirection: 'column',
  }),
  content: cssObj({
    display: 'flex',
    gap: '$1',
    alignItems: 'center',
  }),
  symbol: cssObj({
    fontWeight: '$semibold',
  }),
  assetId: cssObj({
    color: '$gray8',
    fontSize: '$xs',
  }),
};
