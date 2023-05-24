export type FuelWalletError = {
  timestamp?: number;
  id?: string;
} & Error;

export enum ReportErrorFrequency {
  ONCE = 'once',
  ALWAYS = 'always',
  DONT = 'dont',
}
