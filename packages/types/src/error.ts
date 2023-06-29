import type React from 'react';

export type FuelWalletError = {
  timestamp?: number;
  id?: string;
} & Error &
  React.ErrorInfo;
