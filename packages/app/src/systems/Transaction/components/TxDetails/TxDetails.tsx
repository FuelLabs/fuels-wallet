import { log } from 'node:console';
import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
import type {
  BN,
  TransactionRequest,
  TransactionResult,
  TransactionSummary,
} from 'fuels';
import { useState } from 'react';
import { useSimplifiedTransaction } from '../../hooks/useSimplifiedTransaction';
import { TxFeeOptionsSimple } from './TxFeeOptionsSimple';
import { TxFeeSimple } from './TxFeeSimple';
import { TxHeaderSimple } from './TxHeaderSimple';
import { TxOperationsList } from './TxOperationsSimple/TxOperationsList';

export type TxViewVariant = 'default' | 'history';

type TxDetailsProps = {
  summary?: TransactionSummary | TransactionResult;
  request?: TransactionRequest;
  showDetails?: boolean;
  isLoading?: boolean;
  footer?: React.ReactNode;
  variant?: TxViewVariant;
};

export function TxDetails({
  summary,
  request,
  showDetails = true,
  isLoading: externalLoading,
  footer,
  variant = 'default',
}: TxDetailsProps) {
  const [isCustomFees, setIsCustomFees] = useState(false);
  const [_, setSelectedTip] = useState<BN>();
  const isHistory = variant === 'history';

  const { transaction, isReady } = useSimplifiedTransaction({
    summary,
    request,
  });

  if (!isReady || !transaction) return null;

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
                isLoading={externalLoading}
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
