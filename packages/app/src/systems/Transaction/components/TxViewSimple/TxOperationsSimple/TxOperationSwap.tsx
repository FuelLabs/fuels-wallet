import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, Icon, IconButton, Text } from '@fuel-ui/react';
import { useAccounts } from '~/systems/Account';
import { formatAmount, shortAddress } from '~/systems/Core';
import type { SimplifiedOperation } from '../../../types';
import { useAssetSymbols } from './useAssetSymbols';
import { isSwapMetadata } from './utils';

type TxOperationSwapProps = {
  operation: SimplifiedOperation;
};

export function TxOperationSwap({ operation }: TxOperationSwapProps) {
  const { accounts } = useAccounts();
  const { assetSymbols } = useAssetSymbols([operation]);

  if (!isSwapMetadata(operation.metadata)) return null;

  return (
    <>
      <Box.Flex css={styles.line}>
        <Box css={styles.iconCol}>
          <Avatar.Generated hash={operation.to} size={24} />
        </Box>
        <Box.Flex gap="$2" css={styles.contentCol}>
          <Text as="span" fontSize="sm">
            {accounts?.find((a) => a.address === operation.to)?.name ||
              'unknown'}
          </Text>
          <Box css={styles.badge}>
            <Text fontSize="sm" color="gray8">
              Contract
            </Text>
          </Box>
          <Text as="span" fontSize="sm" color="gray8">
            {shortAddress(operation.to)}
          </Text>
          <IconButton
            size="xs"
            variant="link"
            icon="Copy"
            aria-label="Copy address"
            onPress={() => navigator.clipboard.writeText(operation.to)}
          />
        </Box.Flex>
      </Box.Flex>
      <Box.Flex css={styles.line}>
        <Box css={styles.iconCol}>
          <Icon icon="ArrowDown" css={{ color: '$blue9' }} size={16} />
        </Box>
        <Box.Stack gap="$1" css={styles.contentCol}>
          <Text css={{ color: '$blue9' }} fontSize="sm">
            Sends token
          </Text>
          <Box.Flex
            css={{
              display: 'flex',
              gap: '$2',
              alignItems: 'center',
            }}
          >
            <Icon icon="Coins" size={16} />
            <Text fontSize="sm">
              {formatAmount({
                amount: operation.metadata.receiveAmount,
                options: { units: 9 },
              })}{' '}
              {assetSymbols[operation.metadata.receiveAssetId] ||
                shortAddress(operation.metadata.receiveAssetId)}
            </Text>
          </Box.Flex>
        </Box.Stack>
      </Box.Flex>
    </>
  );
}

const styles = {
  line: cssObj({
    display: 'flex',
    alignItems: 'center',
    gap: '$3',
  }),
  iconCol: cssObj({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    flexShrink: 0,
  }),
  contentCol: cssObj({
    display: 'flex',
    flex: 1,
  }),
  badge: cssObj({
    backgroundColor: '$gray3',
    padding: '$1 $2',
    borderRadius: '$md',
    marginLeft: '$2',
  }),
};
