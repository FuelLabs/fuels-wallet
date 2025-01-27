import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import type { BN } from 'fuels';
import { useState } from 'react';
import type { SimplifiedTransactionViewProps } from '../../types';
import { TxFeeOptions } from '../TxFeeOptions/TxFeeOptions';
import { TxFeeOptionsSimple } from './TxFeeOptionsSimple';
import { TxFeeSimple } from './TxFeeSimple';
import { TxHeaderSimple } from './TxHeaderSimple';
import { TxOperationsList } from './TxOperationsSimple/TxOperationsList';

export function TxViewSimple({
  transaction,
  showDetails = true,
  isLoading,
  footer,
}: SimplifiedTransactionViewProps) {
  const [isCustomFees, setIsCustomFees] = useState(false);
  const [_selectedTip, setSelectedTip] = useState<BN>();

  return (
    <Box.Stack css={styles.root}>
      <TxHeaderSimple origin={transaction.origin} isLoading={isLoading} />
      <Box css={styles.content}>
        <TxOperationsList operations={transaction.operations} />
        {showDetails && (
          <Box>
            {isCustomFees ? (
              <TxFeeOptionsSimple
                baseFee={transaction.fee.network}
                onBack={() => setIsCustomFees(false)}
                onTipChange={setSelectedTip}
              />
            ) : (
              <TxFeeSimple
                fee={transaction.fee}
                isLoading={isLoading}
                onCustomFees={() => setIsCustomFees(true)}
                onFeeSelect={setSelectedTip}
              />
            )}
          </Box>
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
    padding: '$1',
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
