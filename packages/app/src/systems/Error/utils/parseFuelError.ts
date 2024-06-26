import { createUUID } from '@fuel-wallet/connections';
import type { FuelWalletError } from '@fuel-wallet/types';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function parseFuelError(error: any): FuelWalletError {
  return {
    ...error,
    timestamp: Date.now(),
    id: createUUID(),
  };
}

export function createError(e: FuelWalletError): FuelWalletError | Error {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  let syntheticError: any = e;
  if (e.error && 'stack' in e.error) {
    syntheticError = new Error(e.error.message);
    syntheticError.stack = e.error.stack;
  } else if (e.reactError && 'componentStack' in e.reactError) {
    syntheticError = new Error('React Error');
    syntheticError.stack = e.reactError.componentStack;
  }

  return syntheticError;
}
