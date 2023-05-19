import type { ErrorReportingFrequency, FuelWalletError } from '../types';

import { ERROR_REPORTING_FREQUENCY_KEY } from '~/config';
import { Storage, db } from '~/systems/Core';

export class ReportErrorService {
  static async reportErrors() {
    const errors = await this.getErrors();
    console.log('errors', errors);
    // get errors
    // send errors to server
    // clear errors
  }

  static async checkForErrors(): Promise<boolean> {
    const errors = await this.getErrors();
    return errors.length > 0;
  }

  static async getErrors(): Promise<FuelWalletError[]> {
    return db.errors.toArray() as Promise<FuelWalletError[]>;
  }

  static async clearErrors() {
    await db.errors.clear();
  }

  getReportErrorFrequency(): ErrorReportingFrequency {
    return Storage.getItem(
      ERROR_REPORTING_FREQUENCY_KEY
    ) as ErrorReportingFrequency;
  }

  setReportErrorFrequency(frequency: ErrorReportingFrequency) {
    return Storage.setItem(ERROR_REPORTING_FREQUENCY_KEY, frequency);
  }
}
