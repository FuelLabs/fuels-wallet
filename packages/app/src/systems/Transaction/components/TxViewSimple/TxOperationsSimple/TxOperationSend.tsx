import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, Icon, IconButton, Text } from '@fuel-ui/react';
import { useAccounts } from '~/systems/Account';
import { formatAmount, shortAddress } from '~/systems/Core';
import type { SimplifiedOperation } from '../../../types';
import { TxCategory } from '../../../types';

type TxOperationSendProps = {
  operation: SimplifiedOperation;
};

export function TxOperationSend({ operation }: TxOperationSendProps) {
  const { accounts } = useAccounts();
  const amount = operation.metadata?.totalAmount || operation.amount || '0';
  const operationCount = operation.metadata?.operationCount;
  const isContractCall = operation.type === TxCategory.CONTRACTCALL;

  // Find if addresses match our accounts
  const fromAccount = accounts?.find(
    (acc) => acc.address.toLowerCase() === operation.from.toLowerCase()
  );
  const toAccount = accounts?.find(
    (acc) => acc.address.toLowerCase() === operation.to.toLowerCase()
  );

  return (
    <Box.Flex css={styles.line}>
      <Box css={styles.iconCol}>
        <Avatar.Generated hash={operation.from} size={24} />
      </Box>
      <Box.Stack gap="$1" css={styles.contentCol}>
        <Box.Flex gap="$2">
          <Text as="span" fontSize="sm">
            {fromAccount ? fromAccount.name : shortAddress(operation.from)}
          </Text>
          <IconButton
            size="xs"
            variant="link"
            icon="Copy"
            aria-label="Copy address"
            onPress={() => navigator.clipboard.writeText(operation.from)}
          />
        </Box.Flex>
        <Box.Stack gap="$2">
          {isContractCall && !toAccount && (
            <Text fontSize="sm" color="gray8">
              Calls contract (sending tokens)
            </Text>
          )}
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
                amount,
                options: { units: 9 },
              })}{' '}
              {shortAddress(operation.assetId)}
            </Text>
            {operationCount && operationCount > 1 ? (
              <Text as="span" color="gray8">
                x{operationCount}
              </Text>
            ) : null}
          </Box.Flex>
          <Box.Flex gap="$2">
            <Text as="span" fontSize="sm">
              {toAccount ? toAccount.name : shortAddress(operation.to)}
            </Text>
            <IconButton
              size="xs"
              variant="link"
              icon="Copy"
              aria-label="Copy address"
              onPress={() => navigator.clipboard.writeText(operation.to)}
            />
          </Box.Flex>
        </Box.Stack>
      </Box.Stack>
    </Box.Flex>
  );
}

const styles = {
  line: cssObj({
    display: 'flex',
    alignItems: 'flex-start',
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
