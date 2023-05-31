import type React from 'react';

export type FuelWalletError = {
  timestamp?: number;
  id?: string;
} & Error &
  React.ErrorInfo;

export enum ReportErrorFrequency {
  ONCE = 'once',
  ALWAYS = 'always',
  DONT = 'dont',
}
