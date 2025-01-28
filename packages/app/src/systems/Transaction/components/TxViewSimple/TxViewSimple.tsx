import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
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
    <Box css={styles.root}>
      <TxHeaderSimple origin={transaction.origin} isLoading={isLoading} />
      <Box css={styles.content}>
        <TxOperationsList operations={transaction.operations} />
        {showDetails && (
          <Box>
            <Box.Flex gap="18px" align="center" css={styles.feeContainer}>
              <Icon icon="CurrencyCent" css={styles.icon} />
              <Text css={styles.title}>Fee (network)</Text>
            </Box.Flex>
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
    </Box>
  );
}

const styles = {
  root: cssObj({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: '#F0F0F0',
    overflow: 'auto',
  }),
  content: cssObj({
    flex: 1,
    padding: '$1 $2',
  }),
  title: cssObj({
    fontSize: '$sm',
    fontWeight: '$medium',
    color: '#202020',
  }),
  feeContainer: cssObj({
    padding: '32px 0 0 20px',
  }),
  icon: cssObj({
    border: '1.5px solid rgb(100, 100, 100)',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    boxSizing: 'border-box',
    '& svg': {
      width: '16px',
      height: '16px',
      strokeWidth: '2.5px',
    },
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
