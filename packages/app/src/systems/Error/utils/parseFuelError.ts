import type { FuelWalletError } from '@fuel-wallet/sdk';
import { createUUID } from '@fuel-wallet/sdk';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseFuelError(error: any): FuelWalletError {
  return {
    ...error,
    timestamp: Date.now(),
    id: createUUID(),
  };
}
