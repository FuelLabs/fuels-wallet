import { bn } from 'fuels';
import { useMemo } from 'react';
import type { GroupedErrors, StructuredError } from '../utils/error';
import { detectInsufficientMaxFee } from '../utils/error';

type InsufficientFeeErrorResult = {
  insufficientFeeError: StructuredError | null;
  isInsufficientFeeError: boolean;
  suggestedMinFee: ReturnType<typeof bn> | undefined;
};

export function useInsufficientFeeError(errors: {
  txApproveError?: unknown;
  simulateTxErrors?: GroupedErrors;
}): InsufficientFeeErrorResult {
  const sendError = useMemo(
    () => detectInsufficientMaxFee(errors.txApproveError),
    [errors.txApproveError]
  );

  const simulateError = useMemo(() => {
    if (
      typeof errors.simulateTxErrors === 'object' &&
      errors.simulateTxErrors?.isInsufficientMaxFee
    ) {
      return errors.simulateTxErrors;
    }
    return null;
  }, [errors.simulateTxErrors]);

  const insufficientFeeError = sendError || simulateError;
  const isInsufficientFeeError = Boolean(insufficientFeeError);

  const suggestedMinFee = useMemo(() => {
    const details = insufficientFeeError?.details;
    if (details?.maxFeeFromGasPrice) {
      return bn(details.maxFeeFromGasPrice).mul(110).div(100);
    }
    return undefined;
  }, [insufficientFeeError]);

  return { insufficientFeeError, isInsufficientFeeError, suggestedMinFee };
}
