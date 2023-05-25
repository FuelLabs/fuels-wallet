import type { FuelWalletError, ReportErrorFrequency } from '@fuel-wallet/types';

import { REPORT_ERROR_FREQUENCY_KEY, DEV_EMAIL } from '~/config';
import { Storage, db } from '~/systems/Core';

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
    );
    window?.open(
      `mailto:${DEV_EMAIL}?subject=Fuel Wallet Error Report&body=${errorMailBody}`,
      '_blank'
    );
    return true;
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
