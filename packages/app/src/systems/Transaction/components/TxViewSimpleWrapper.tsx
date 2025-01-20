import type { TransactionRequest, TransactionSummary } from 'fuels';
import { useSimplifiedTransaction } from '../hooks/useSimplifiedTransaction';
import { TxViewSimple } from './TxViewSimple';

type TxViewSimpleWrapperProps = {
  summary?: TransactionSummary;
  request?: TransactionRequest;
  showDetails?: boolean;
  isLoading?: boolean;
  footer?: React.ReactNode;
};

export function TxViewSimpleWrapper({
  summary,
  request,
  showDetails,
  isLoading: externalLoading,
  footer,
}: TxViewSimpleWrapperProps) {
  console.log('TxViewSimpleWrapper props:', {
    hasSummary: !!summary,
    hasRequest: !!request,
    externalLoading,
  });

  // If we have a summary but no explicit status, treat it as pending
  const hasValidStatus = !!summary;

  // Only show loader for external loading or no summary
  if (!hasValidStatus || externalLoading) {
    console.log('Showing loader because:', {
      missingStatus: !hasValidStatus,
      externalLoading,
      summaryExists: !!summary,
    });
    return <TxViewSimple.Loader />;
  }

  const { transaction, isReady } = useSimplifiedTransaction({
    summary,
    request,
  });

  console.log('useSimplifiedTransaction result:', {
    hasTransaction: !!transaction,
    isReady,
    transactionStatus: transaction?.status,
    operationsCount: transaction?.operations?.length,
  });

  if (!isReady || !transaction) return null;

  return (
    <TxViewSimple
      transaction={transaction}
      showDetails={showDetails}
      footer={footer}
    />
  );
}
