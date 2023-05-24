import type { FuelWalletError } from '@fuel-wallet/sdk';
import { createUUID } from '@fuel-wallet/sdk';

export function errorToFuelError(error: Error): FuelWalletError {
  return {
    ...error,
    message: error?.message,
    stack: error?.stack,
    timestamp: Date.now(),
    id: createUUID(),
    name: error?.name,
  };
}
