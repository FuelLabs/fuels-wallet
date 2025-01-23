import { cssObj } from '@fuel-ui/css';
import { Box, Text } from '@fuel-ui/react';
import type { SimplifiedOperation } from '../../../../types';
import { TxAddressDisplay } from './TxAddressDisplay';
import { TxAssetDisplay } from './TxAssetDisplay';

type TxOperationTransferProps = {
  operation: SimplifiedOperation;
};

export function TxOperationTransfer({ operation }: TxOperationTransferProps) {
  const amount = (
    operation.metadata?.totalAmount ||
    operation.amount ||
    '0'
  ).toString();
  const operationCount = operation.metadata?.operationCount;
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
        <TxAddressDisplay address={operation.from} />
        <TxAssetDisplay
          amount={amount}
          assetId={operation.assetId}
          operationCount={operationCount}
        />
        <TxAddressDisplay address={operation.to} />
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
  contentCol: cssObj({
    display: 'flex',
    flex: 1,
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
