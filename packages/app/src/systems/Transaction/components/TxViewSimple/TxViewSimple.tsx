import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
import type { BN } from 'fuels';
import { useState } from 'react';
import { useAccounts } from '~/systems/Account';
import type { SimplifiedTransactionViewProps } from '../../types';
import { TxFeeOptionsSimple } from './TxFeeOptionsSimple';
import { TxFeeSimple } from './TxFeeSimple';
import { TxHeaderSimple } from './TxHeaderSimple';
import { TxOperationsList } from './TxOperationsSimple/TxOperationsList';

export type TxViewVariant = 'default' | 'history';

type TxViewSimpleProps = SimplifiedTransactionViewProps & {
  variant?: TxViewVariant;
};

export function TxViewSimple({
  transaction,
  showDetails = true,
  isLoading,
  footer,
  variant = 'default',
}: TxViewSimpleProps) {
  const [isCustomFees, setIsCustomFees] = useState(false);
  const [_selectedTip, setSelectedTip] = useState<BN>();
  const isHistory = variant === 'history';
  // const { account } = useAccounts();

  return (
    <Box css={styles.root}>
      {!isHistory && <TxHeaderSimple />}
      <Box css={styles.content}>
        <TxOperationsList operations={transaction.categorizedOperations} />
        {showDetails && !isHistory && (
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
    background: '$gray3',
    overflow: 'auto',
  }),
  content: cssObj({
    flex: 1,
    padding: '$1 $2',
  }),
  title: cssObj({
    fontSize: '$sm',
    fontWeight: '$medium',
    color: '$gray12',
  }),
  feeContainer: cssObj({
    padding: '32px 0 0 20px',
  }),
  icon: cssObj({
    border: '1.5px solid $gray9',
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
      <TxHeaderSimple />
      <TxOperationsList.Loader />
      <TxFeeSimple.Loader />
    </Box.Stack>
  );
};
