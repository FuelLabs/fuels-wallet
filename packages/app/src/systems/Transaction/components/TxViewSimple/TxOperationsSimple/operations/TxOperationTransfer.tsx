import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
import { ReceiptType } from 'fuels';
import type { SimplifiedOperation } from '../../../../types';
import { TxAddressDisplay } from './TxAddressDisplay';
import { TxAssetDisplay } from './TxAssetDisplay';
import { TxOperationNesting } from './TxOperationNesting';

type TxOperationTransferProps = {
  operation: SimplifiedOperation;
};

export function TxOperationTransfer({ operation }: TxOperationTransferProps) {
  const depth = operation.metadata?.depth || 0;
  const receiptType = operation.metadata?.receiptType;

  return (
    <Box.Flex css={styles.root}>
      <TxOperationNesting depth={depth} />
      <Box.Stack gap="$3" css={styles.contentCol}>
        <Box.Flex css={styles.header}>
          <Text fontSize="xs" css={styles.typeLabel}>
            Transfer
          </Text>
          {receiptType && (
            <Text fontSize="xs" css={styles.receiptLabel}>
              {receiptType}
            </Text>
          )}
        </Box.Flex>
        {/* From address */}
        <TxAddressDisplay address={operation.from} label="From" />
        {/* Asset amount with arrow */}
        <Box.Flex css={styles.amountRow}>
          <Icon icon="ArrowDown" css={styles.arrow} />
          <Box.Stack gap="$0">
            <TxAssetDisplay
              amount={operation.amount?.toString() || '0'}
              assetId={operation.assetId}
              showLabel
            />
          </Box.Stack>
        </Box.Flex>
        {/* To address */}
        <TxAddressDisplay address={operation.to} label="To" />
      </Box.Stack>
    </Box.Flex>
  );
}

const styles = {
  root: cssObj({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '$2',
    padding: '$3',
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
  receiptLabel: cssObj({
    color: '$blue9',
    backgroundColor: '$blue3',
    padding: '$1 $2',
    borderRadius: '$md',
    fontWeight: '$normal',
  }),
  amountRow: cssObj({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '$2',
    marginLeft: '$2',
  }),
  arrow: cssObj({
    color: '$gray8',
    marginTop: '$1',
  }),
};
