import type { ErrorInfo } from 'react';

export type FuelWalletError = {
  timestamp?: number;
  id?: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  error?: Error | ErrorEvent | { message: string; stack?: any };
};

export type SentryExtraErrorData = {
  timestamp: number;
  location: string;
  pathname: string;
  hash: string;
  counts?: number;
};

export type StoredFuelWalletError = {
  error: Error;
  extra: SentryExtraErrorData;
  id: string;
};
