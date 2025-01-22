import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import { useSimplifyTransaction } from '../../hooks/useSimplifyTransaction';
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
  const { simplifiedOperations } = useSimplifyTransaction(
    transaction.operations
  );

  return (
    <Box.Stack css={styles.root}>
      <TxHeaderSimple
        status={transaction.status}
        origin={transaction.origin}
        isLoading={isLoading}
      />
      <Box css={styles.content}>
        <TxOperationsList operations={simplifiedOperations} />
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
