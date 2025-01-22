import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, Icon, IconButton, Spinner, Text } from '@fuel-ui/react';
import { useAccounts } from '~/systems/Account';
import { formatAmount, shortAddress } from '~/systems/Core';
import type { SimplifiedOperation } from '../../../../types';
import { useEcosystemProject } from '../useEcosystemProject';

type TxOperationContractAssetProps = {
  operation: SimplifiedOperation;
};

export function TxOperationContractAsset({
  operation,
}: TxOperationContractAssetProps) {
  const { accounts } = useAccounts();
  const amount = operation.metadata?.totalAmount || operation.amount || '0';
  const {
    name: projectName,
    image: projectImage,
    isLoading,
  } = useEcosystemProject(operation.to);

  const toAccount = accounts?.find(
    (acc) => acc.address.toLowerCase() === operation.to.toLowerCase()
  );

  const isReceiving = toAccount !== undefined;

  return (
    <Box.Flex css={styles.root}>
      <Box css={styles.iconCol}>
        {isLoading ? (
          <Spinner size={24} />
        ) : projectImage ? (
          <Avatar
            src={projectImage}
            size={24}
            name={projectName || 'Contract'}
          />
        ) : (
          <Avatar.Generated hash={operation.to} size={24} />
        )}
      </Box>
      <Box.Stack gap="$2" css={styles.contentCol}>
        <Box.Flex gap="$2">
          <Text as="span" fontSize="sm">
            {isLoading
              ? 'Loading...'
              : projectName || shortAddress(operation.to)}
          </Text>
          {!toAccount && (
            <Box css={styles.badge}>
              <Text fontSize="sm" color="gray8">
                Contract
              </Text>
            </Box>
          )}
          <IconButton
            size="xs"
            variant="link"
            icon="Copy"
            aria-label="Copy address"
            onPress={() => navigator.clipboard.writeText(operation.to)}
          />
        </Box.Flex>
        <Box.Flex css={styles.line}>
          <Box css={styles.iconCol}>
            <Icon
              icon={isReceiving ? 'ArrowUp' : 'ArrowDown'}
              css={{ color: '$blue9' }}
              size={16}
            />
          </Box>
          <Box.Stack gap="$1" css={styles.contentCol}>
            <Text css={{ color: '$blue9' }} fontSize="sm">
              {isReceiving ? 'Receives token' : 'Sends token'}
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
                  amount,
                  options: { units: 9 },
                })}{' '}
                {shortAddress(operation.assetId)}
              </Text>
            </Box.Flex>
          </Box.Stack>
        </Box.Flex>
      </Box.Stack>
    </Box.Flex>
  );
}

const styles = {
  root: cssObj({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '$3',
    padding: '$3',
    backgroundColor: '$cardBg',
    borderRadius: '$md',
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
  line: cssObj({
    display: 'flex',
    alignItems: 'center',
    gap: '$3',
  }),
};
