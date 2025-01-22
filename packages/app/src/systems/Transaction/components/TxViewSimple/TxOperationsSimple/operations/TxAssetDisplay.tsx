import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
import { formatAmount, shortAddress } from '~/systems/Core';

type TxAssetDisplayProps = {
  amount: string;
  assetId?: string;
  label?: string;
  showIcon?: boolean;
  operationCount?: number;
};

export function TxAssetDisplay({
  amount,
  assetId,
  label,
  showIcon = true,
  operationCount,
}: TxAssetDisplayProps) {
  return (
    <Box.Stack gap="$0" css={styles.root}>
      {label && (
        <Text css={{ color: '$blue9' }} fontSize="sm">
          {label}
        </Text>
      )}
      <Box.Flex css={styles.content}>
        {showIcon && <Icon icon="Coins" size={14} />}
        <Text fontSize="sm">
          {formatAmount({
            amount,
            options: { units: 9 }, // Default to 9 decimals
          })}{' '}
          {assetId ? shortAddress(assetId) : 'Unknown Asset'}
          {operationCount && operationCount > 1 ? (
            <Text as="span" color="gray8">
              {' '}
              x{operationCount}
            </Text>
          ) : null}
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
};
