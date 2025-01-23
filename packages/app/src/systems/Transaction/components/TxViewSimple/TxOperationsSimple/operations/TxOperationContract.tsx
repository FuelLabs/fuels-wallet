import { cssObj } from '@fuel-ui/css';
import { Alert, Box, Icon, Text } from '@fuel-ui/react';
import type { SimplifiedOperation } from '../../../../types';
import { useEcosystemProject } from '../useEcosystemProject';
import { TxAddressDisplay } from './TxAddressDisplay';
import { TxAssetDisplay } from './TxAssetDisplay';

type TxOperationContractProps = {
  operation: SimplifiedOperation;
};

export function TxOperationContract({ operation }: TxOperationContractProps) {
  const {
    name: projectName,
    image: projectImage,
    isLoading,
  } = useEcosystemProject(operation.to);

  const metadata = operation.metadata;
  const hasAsset = Boolean(operation.amount);
  const isGrouped = metadata?.operationCount && metadata.operationCount > 1;
  const amount = (metadata?.totalAmount || operation.amount || '0').toString();
  const depth = operation.depth || 0;

  return (
    <Box.Flex css={styles.root}>
      <Box css={styles.depthIndicator(depth)} />
      <Box.Stack gap="$1" css={styles.contentCol}>
        {operation.isRoot && (
          <Text fontSize="xs" color="gray8" css={styles.rootTag}>
            root
          </Text>
        )}
        <TxAddressDisplay
          address={operation.to}
          name={projectName}
          image={projectImage}
          isLoading={isLoading}
          isContract
        />
        {isGrouped && (
          <Alert status="info" css={styles.alert} hideIcon>
            <Alert.Description>
              This contract call occurs {metadata.operationCount} times
            </Alert.Description>
          </Alert>
        )}
        <Box.Flex css={styles.line}>
          <Box css={styles.iconCol}>
            <Icon
              icon={hasAsset ? 'ArrowDown' : 'Code'}
              css={{ color: hasAsset ? '$blue9' : '$gray8' }}
              size={16}
            />
          </Box>
          {hasAsset ? (
            <TxAssetDisplay
              amount={amount}
              assetId={operation.assetId}
              label="Sends token"
              showIcon={false}
              operationCount={metadata?.operationCount}
            />
          ) : (
            <Text css={{ color: '$gray8' }} fontSize="sm">
              Contract interaction
            </Text>
          )}
        </Box.Flex>
      </Box.Stack>
    </Box.Flex>
  );
}

const styles = {
  root: cssObj({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '$2',
    padding: '$2',
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
  line: cssObj({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '$2',
  }),
  alert: cssObj({
    backgroundColor: '$gray3',
    border: 'none',
    padding: '$1',
  }),
  rootTag: cssObj({
    backgroundColor: '$gray3',
    padding: '0 $1',
    borderRadius: '$xs',
    alignSelf: 'flex-start',
  }),
  depthIndicator: (depth: number) =>
    cssObj({
      width: depth ? '2px' : '0',
      minWidth: depth ? '2px' : '0',
      backgroundColor: '$gray4',
      marginLeft: `${depth * 8}px`,
      alignSelf: 'stretch',
    }),
};
