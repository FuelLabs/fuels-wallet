import { createUUID } from '@fuel-wallet/connections';
import type { FuelWalletError } from '@fuel-wallet/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseFuelError(error: any): FuelWalletError {
  return {
    ...error,
    timestamp: Date.now(),
    id: createUUID(),
  };
}

export function createError(e: FuelWalletError): FuelWalletError | Error {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let syntheticError: any = e;

  if (e.error && 'stack' in e.error) {
    syntheticError = new Error(e.error.message);
    syntheticError.stack = e.error.stack;
  } else if (e.reactError) {
    syntheticError = new Error('React Error');
    syntheticError.stack = e.reactError.componentStack;
  }

  return syntheticError;
}
