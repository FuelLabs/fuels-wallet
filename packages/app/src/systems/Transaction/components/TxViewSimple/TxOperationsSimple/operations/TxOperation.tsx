import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
import { ReceiptType } from 'fuels';
import { TxCategory } from '../../../../types';
import type { SimplifiedOperation } from '../../../../types';
import { TxAddressDisplay } from './TxAddressDisplay';
import { TxAssetDisplay } from './TxAssetDisplay';
import { TxOperationNesting } from './TxOperationNesting';

type TxOperationProps = {
  operation: SimplifiedOperation;
};

export function TxOperation({ operation }: TxOperationProps) {
  const metadata = operation.metadata;
  const amount = metadata?.amount || operation.amount;
  const assetId = metadata?.assetId || operation.assetId;
  const hasAsset = Boolean(amount && assetId);
  const depth = metadata?.depth || 0;
  const receiptType = metadata?.receiptType;
  const isContract = operation.type === TxCategory.CONTRACTCALL;

  const receiptTypeLabel = receiptType ? ReceiptType[receiptType] : null;

  if (depth !== 0) return null;

  return (
    <Box.Flex css={styles.root}>
      <TxOperationNesting depth={depth} />
      <Box.Stack gap="$2" css={styles.contentCol}>
        <Box.Flex css={styles.header}>
          <Text fontSize="xs" css={styles.typeLabel}>
            {isContract ? 'Contract Call' : 'Transfer'}
          </Text>
          {receiptType && (
            <Text fontSize="xs" css={styles.receiptLabel}>
              {receiptTypeLabel}
            </Text>
          )}
        </Box.Flex>
        <TxAddressDisplay address={operation.from} label="From" />
        <TxAddressDisplay
          address={operation.to}
          label={isContract ? 'Contract' : 'To'}
          isContract={isContract}
        />
        {hasAsset && amount && assetId && (
          <Box.Stack gap="$0">
            {!isContract && <Icon icon="ArrowDown" css={styles.arrow} />}
            <TxAssetDisplay
              amount={amount.toString()}
              assetId={assetId}
              showLabel={!isContract}
            />
          </Box.Stack>
        )}
        {metadata?.functionName && (
          <Box css={styles.functionName}>Function: {metadata.functionName}</Box>
        )}
      </Box.Stack>
    </Box.Flex>
  );
}
// root level rule is only for contract calls, all transfers should show as well
// we also have the operations not related to the account in a group, and intermediate contract calls
const styles = {
  root: cssObj({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '$2',
    padding: '$3',
    backgroundColor: '$cardBg',
    borderRadius: '$md',
    width: '100%',
    minWidth: 0,
  }),
  contentCol: cssObj({
    display: 'flex',
    flex: 1,
    minWidth: 0,
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
  arrow: cssObj({
    color: '$gray8',
    marginTop: '$1',
    marginLeft: '$2',
  }),
  functionName: cssObj({
    fontSize: '$sm',
    color: '$gray8',
  }),
};
