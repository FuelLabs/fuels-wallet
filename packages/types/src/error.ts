import type { ErrorInfo } from 'react';

export type FuelWalletError = {
  timestamp?: number;
  id?: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  error?: Error | ErrorEvent | { message: string; stack?: any };
  reactError?: ErrorInfo;
};
