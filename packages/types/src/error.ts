/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from 'react';

export type FuelWalletError = {
  timestamp?: number;
  id?: string;
  error?: Error | ErrorEvent | { message: string; stack?: any };
  reactError?: React.ErrorInfo;
};
