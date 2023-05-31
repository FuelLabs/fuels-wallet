import type { FuelWalletError, ReportErrorFrequency } from '@fuel-wallet/types';

import { parseFuelError, parseErrorEmail } from '../utils';

import { REPORT_ERROR_FREQUENCY_KEY, REPORT_ERROR_EMAIL } from '~/config';
import { Storage, db } from '~/systems/Core/utils';

export class ReportErrorService {
  static async reportErrors() {
    const errors = await this.getErrors();
    // send error as an email to the team
    const errorMailBody = parseErrorEmail(errors);
    window?.open(
      `mailto:${REPORT_ERROR_EMAIL}?subject=Fuel Wallet Error Report&body=${errorMailBody}`,
      '_blank'
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static handleError(error: any) {
    try {
      // handle only network errors for now
      if (error?.response?.status) {
        const status = error.response.status;
        if (status + ''.startsWith('5')) {
          const formatedError = parseFuelError(error as Error);
          this.saveError(formatedError);
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  static saveError(error: FuelWalletError) {
    return db.errors.add(error);
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
