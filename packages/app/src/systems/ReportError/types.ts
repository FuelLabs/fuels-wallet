export type FuelWalletError = {
  timestamp: number;
  id: string;
} & Error;

export enum ErrorReportingFrequency {
  ONCE = 'once',
  ALWAYS = 'always',
  NEVER = 'never',
}
