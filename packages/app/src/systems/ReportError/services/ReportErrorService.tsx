import type { ReportErrorFrequency, FuelWalletError } from '../types';

import { REPORT_ERROR_FREQUENCY_KEY } from '~/config';
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

  static getReportErrorFrequency(): ReportErrorFrequency {
    return Storage.getItem(REPORT_ERROR_FREQUENCY_KEY) as ReportErrorFrequency;
  }

  static setReportErrorFrequency(frequency: ReportErrorFrequency) {
    return Storage.setItem(REPORT_ERROR_FREQUENCY_KEY, frequency);
  }
}
