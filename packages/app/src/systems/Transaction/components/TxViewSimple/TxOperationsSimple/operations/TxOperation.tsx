import { cssObj } from '@fuel-ui/css';
import { Avatar, AvatarGenerated, Box, Icon, Text } from '@fuel-ui/react';
import { ReceiptType } from 'fuels';
import { useContractMetadata } from '~/systems/Contract/hooks/useContractMetadata';
import { TxCategory } from '../../../../types';
import type { SimplifiedOperation } from '../../../../types';
import { TxRecipientContractLogo } from '../../../TxRecipientCard/TxRecipientContractLogo';
import { TxAddressDisplay } from './TxAddressDisplay';
import { TxAssetDisplay } from './TxAssetDisplay';
import { TxOperationNesting } from './TxOperationNesting';

type TxOperationProps = {
  operation: SimplifiedOperation;
  showNesting?: boolean;
};

export function TxOperation({
  operation,
  showNesting = true,
}: TxOperationProps) {
  const metadata = operation.metadata;
  const amount = metadata?.amount || operation.amount;
  const assetId = metadata?.assetId || operation.assetId;
  const hasAsset = Boolean(amount && assetId);
  const depth = metadata?.depth || 0;
  const receiptType = metadata?.receiptType;
  const isContract = operation.type === TxCategory.CONTRACTCALL;
  const isTransfer = operation.type === TxCategory.SEND;
  const _contract = useContractMetadata(operation.from);

  const receiptTypeLabel = receiptType ? ReceiptType[receiptType] : null;

  // For transfers, always show with 0 indentation
  // For contract calls, only show if root level (depth === 0) unless showNesting is true
  if (isContract && !showNesting && depth !== 0) return null;

  return (
    <Box.Flex css={styles.root}>
      {isContract && showNesting && <TxOperationNesting depth={depth} />}
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
        <TxAddressDisplay address={operation.from} />
        {isTransfer && (
          <Icon icon="CircleArrowDown" css={styles.arrow} size={16} />
        )}
        <TxAddressDisplay address={operation.to} isContract={isContract} />
        {hasAsset && amount && assetId && (
          <Box.Stack gap="$0">
            <TxAssetDisplay
              amount={amount.toString()}
              assetId={assetId}
              showLabel={isTransfer}
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
// we also have the operations not related to the account in a group, and intermediate contract calls
const styles = {
  root: cssObj({
    padding: '$1',
    backgroundColor: '#E0E0E0',
    borderRadius: '12px',
    width: '100%',
    boxSizing: 'border-box',
  }),
  contentCol: cssObj({
    display: 'flex',
    backgroundColor: 'white',
    boxShadow: '0px 2px 6px -1px #2020201A, 0px 0px 0px 1px #2020201F',
    flex: 1,
    borderRadius: '8px',
    minWidth: 0,
    padding: '$3',
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
    color: '#0D74CE',
  }),
  functionName: cssObj({
    fontSize: '$sm',
    color: '$gray8',
  }),
};
