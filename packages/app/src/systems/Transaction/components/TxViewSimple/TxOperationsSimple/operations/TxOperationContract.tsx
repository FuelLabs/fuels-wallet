import { cssObj } from '@fuel-ui/css';
import { Box, Text } from '@fuel-ui/react';
import type { SimplifiedOperation } from '../../../../types';
import { TxAddressDisplay } from './TxAddressDisplay';
import { TxAssetDisplay } from './TxAssetDisplay';
import { TxOperationNesting } from './TxOperationNesting';

type TxOperationContractProps = {
  operation: SimplifiedOperation;
};

export function TxOperationContract({ operation }: TxOperationContractProps) {
  const metadata = operation.metadata;
  const amount = metadata?.amount;
  const assetId = metadata?.assetId;
  const hasAsset = Boolean(amount && assetId);
  const depth = metadata?.depth || 0;

  return (
    <Box.Flex css={styles.root}>
      <TxOperationNesting depth={depth} />
      <Box.Stack gap="$1" css={styles.contentCol}>
        <Box.Flex css={styles.header}>
          <Text fontSize="xs" css={styles.typeLabel}>
            Contract Call
          </Text>
        </Box.Flex>
        <TxAddressDisplay address={operation.from} label="From" />
        <TxAddressDisplay address={operation.to} label="Contract" isContract />
        {hasAsset && amount && assetId && (
          <Box.Stack gap="$0">
            <TxAssetDisplay amount={amount.toString()} assetId={assetId} />
          </Box.Stack>
        )}
        {metadata?.functionName && (
          <Box css={styles.functionName}>Function: {metadata.functionName}</Box>
        )}
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
    width: '100%',
    minWidth: 0, // Prevent flex items from overflowing
  }),
  contentCol: cssObj({
    display: 'flex',
    flex: 1,
    minWidth: 0, // Allow content to shrink if needed
  }),
  header: cssObj({
    display: 'flex',
    alignItems: 'center',
    gap: '$2',
  }),
  typeLabel: cssObj({
    color: '$gray8',
    backgroundColor: '$gray3',
    padding: '$1 $2',
    borderRadius: '$md',
    fontWeight: '$normal',
  }),
  functionName: cssObj({
    fontSize: '$sm',
    color: '$gray8',
  }),
};
