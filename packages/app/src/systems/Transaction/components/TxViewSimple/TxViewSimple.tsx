import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import type { SimplifiedTransactionViewProps } from '../../types';
import { TxFeeSimple } from './TxFeeSimple';
import { TxHeaderSimple } from './TxHeaderSimple';
import { TxOperationsSimple } from './TxOperationsSimple';

export function TxViewSimple({
  transaction,
  showDetails = true,
  isLoading,
  footer,
}: SimplifiedTransactionViewProps) {
  return (
    <Box.Stack css={styles.root}>
      <TxHeaderSimple
        status={transaction.status}
        origin={transaction.origin}
        isLoading={isLoading}
      />
      <Box css={styles.content}>
        <TxOperationsSimple
          operations={transaction.operations}
          isLoading={isLoading}
        />
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
    display: 'flex',
    flexDirection: 'column',
  }),
  content: cssObj({
    padding: '$1',
    display: 'flex',
    flexDirection: 'column',
    gap: '$1',
  }),
};

// Add a loader component for loading states
TxViewSimple.Loader = function TxViewSimpleLoader() {
  return (
    <Box.Stack gap="$4">
      <TxHeaderSimple.Loader />
      <TxOperationsSimple.Loader />
      <TxFeeSimple.Loader />
    </Box.Stack>
  );
};
