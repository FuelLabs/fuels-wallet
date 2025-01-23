import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import type { SimplifiedTransactionViewProps } from '../../types';
import { TxFeeSimple } from './TxFeeSimple';
import { TxHeaderSimple } from './TxHeaderSimple';
import { TxOperationsList } from './TxOperationsSimple/TxOperationsList';

export function TxViewSimple({
  transaction,
  showDetails = true,
  isLoading,
  footer,
}: SimplifiedTransactionViewProps) {
  console.log('Rapid fire', transaction);
  return (
    <Box.Stack css={styles.root}>
      <TxHeaderSimple origin={transaction.origin} isLoading={isLoading} />
      <Box css={styles.content}>
        <TxOperationsList operations={transaction.operations} />
        {showDetails && (
          <TxFeeSimple fee={transaction.fee} isLoading={isLoading} />
        )}
        {footer}
      </Box>
    </Box.Stack>
  );
}

const styles = {
  root: cssObj({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  }),
  content: cssObj({
    flex: 1,
    overflowY: 'auto',
    padding: '$4',
  }),
};

// Add a loader component for loading states
TxViewSimple.Loader = function TxViewSimpleLoader() {
  return (
    <Box.Stack gap="$4">
      <TxHeaderSimple.Loader />
      <TxOperationsList.Loader />
      <TxFeeSimple.Loader />
    </Box.Stack>
  );
};
