import { createUUID } from '@fuel-wallet/connections';
import type { FuelWalletError } from '@fuel-wallet/types';

const SANITIZE_REGEXP = /private key: \w+/g;

export function parseFuelError({
  error,
  reactError,
}: Pick<FuelWalletError, 'error' | 'reactError'>): FuelWalletError {
  function sanitize<
    T extends FuelWalletError['error'] | FuelWalletError['reactError'],
  >(error: T) {
    if (!error) return error;

    const sanitized: T = {} as NonNullable<T>;

    for (const key in Object.keys(error)) {
      if (error[key]) {
        sanitized[key] = error[key].replace(
          SANITIZE_REGEXP,
          'private key: [REDACTED]'
        );
      }
    }
    return sanitized;
  }

  try {
    const sanitizedError = {
      error: sanitize(error),
      reactError: sanitize(reactError),
    };

    return {
      ...sanitizedError,
      timestamp: Date.now(),
      id: createUUID(),
      location: window ? window.location.href : '-',
      pathname: window ? window.location.pathname : '-',
      hash: window ? window.location.hash : '-',
    } as FuelWalletError;
  } catch (_) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return error as any;
  }
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
