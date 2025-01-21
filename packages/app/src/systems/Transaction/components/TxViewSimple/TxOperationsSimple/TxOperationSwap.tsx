import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, Icon, IconButton, Spinner, Text } from '@fuel-ui/react';
import { formatAmount, shortAddress } from '~/systems/Core';
import type { SimplifiedOperation } from '../../../types';
import { useAssetSymbols } from './useAssetSymbols';
import { useEcosystemProject } from './useEcosystemProject';
import { isSwapMetadata } from './utils';

type TxOperationSwapProps = {
  operation: SimplifiedOperation;
};

export function TxOperationSwap({ operation }: TxOperationSwapProps) {
  const { assetSymbols } = useAssetSymbols([operation]);
  const {
    name: projectName,
    image: projectImage,
    isLoading,
  } = useEcosystemProject(operation.to);

  if (!isSwapMetadata(operation.metadata)) return null;

  return (
    <>
      <Box.Flex css={styles.line}>
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
        <Box.Flex gap="$2" css={styles.contentCol}>
          <Text as="span" fontSize="sm">
            {isLoading
              ? 'Loading...'
              : projectName || shortAddress(operation.to)}
          </Text>
          <Box css={styles.badge}>
            <Text fontSize="sm" color="gray8">
              Contract
            </Text>
          </Box>
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
