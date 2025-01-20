import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
import { formatAmount, shortAddress } from '~/systems/Core';
import type { SimplifiedOperation } from '../../../types';
import { useAssetSymbols } from './useAssetSymbols';

type TxOperationSendProps = {
  operation: SimplifiedOperation;
};

export function TxOperationSend({ operation }: TxOperationSendProps) {
  const { assetSymbols } = useAssetSymbols([operation]);

  return (
    <Box.Flex css={styles.line}>
      <Box.Stack gap="$1" css={styles.contentCol}>
        <Box.Stack gap="$2">
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
                amount: operation.amount || '0',
                options: { units: 9 },
              })}{' '}
              {assetSymbols[operation.assetId || ''] ||
                shortAddress(operation.assetId)}
            </Text>
          </Box.Flex>
        </Box.Stack>
      </Box.Stack>
    </Box.Flex>
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
};
