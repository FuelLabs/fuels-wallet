import { useMemo } from 'react';
import type { GroupedErrors, VMApiError } from '../utils/error';
import { detectInsufficientMaxFee } from '../utils/error';

type InsufficientFeeErrorResult = {
  isInsufficientFeeError: boolean;
  displayErrors: GroupedErrors;
};

export function useInsufficientFeeError(errors: {
  txApproveError?: VMApiError;
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

  const displayErrors = useMemo<GroupedErrors>(() => {
    if (insufficientFeeError) return insufficientFeeError;
    if (errors.simulateTxErrors) return errors.simulateTxErrors;
    if (errors.txApproveError) {
      const err = errors.txApproveError;
      const msgs = err?.response?.errors
        ?.map((e: { message: string }) => e.message)
        .join('; ');
      return msgs || JSON.stringify(err);
    }
    return undefined;
  }, [insufficientFeeError, errors.simulateTxErrors, errors.txApproveError]);

  return {
    isInsufficientFeeError,
    displayErrors,
  };
}
