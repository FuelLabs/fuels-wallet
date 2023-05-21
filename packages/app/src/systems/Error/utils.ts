import { createUUID } from '@fuel-wallet/sdk';

import type { FuelWalletError } from './types';

export function errorToFuelError(
  errorEvent: ErrorEvent | PromiseRejectionEvent
): FuelWalletError {
  const error =
    errorEvent instanceof ErrorEvent ? errorEvent?.error : errorEvent?.reason;
  return {
    ...error,
    message: error?.message,
    stack: error?.stack,
    timestamp: Date.now(),
    id: createUUID(),
    name: error?.name,
  };
}
