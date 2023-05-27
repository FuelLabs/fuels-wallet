import type { FuelWalletError, ReportErrorFrequency } from '@fuel-wallet/types';

import { errorToFuelError } from '../utils';

import { REPORT_ERROR_FREQUENCY_KEY, REPORT_ERROR_EMAIL } from '~/config';
import { Storage, db } from '~/systems/Core/utils';

function encodeHTMLEntities(text: string) {
  const textArea = document.createElement('textarea');
  textArea.innerText = text;
  return textArea.innerHTML;
}

export class ReportErrorService {
  static async reportErrors() {
    const errors = await this.getErrors();
    // send error as an email to the team
    const errorMailBody = encodeHTMLEntities(
      errors.map((error) => JSON.stringify(error)).join('\n')
    ).slice(0, 2000);
    window?.open(
      `mailto:${REPORT_ERROR_EMAIL}?subject=Fuel Wallet Error Report&body=${errorMailBody}`,
      '_blank'
    );
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static handleError(error: any) {
    try {
      // handle only network errors for now
      if (error?.response?.status) {
        const status = error.response.status;
        if (status + ''.startsWith('5')) {
          const formatedError = errorToFuelError(error as Error);
          return this.saveError(formatedError);
        }
      }
      return true;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return true;
    }
  }

  private static saveError(error: FuelWalletError) {
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
