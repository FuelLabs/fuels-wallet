import type {
  TransactionRequest,
  TransactionResult,
  TransactionSummary,
} from 'fuels';
import { useSimplifiedTransaction } from '../hooks/useSimplifiedTransaction';
import { TxViewSimple } from './TxViewSimple';

type TxViewSimpleWrapperProps = {
  summary?: TransactionSummary | TransactionResult;
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
  // If we have a summary but no explicit status, treat it as pending
  const hasValidStatus = !!summary;

  if (!hasValidStatus || externalLoading) {
    return <TxViewSimple.Loader />;
  }

  const { transaction, isReady } = useSimplifiedTransaction({
    summary,
    request,
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
