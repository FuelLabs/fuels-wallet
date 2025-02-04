import type { StoredFuelWalletError } from '@fuel-wallet/types';
import { db } from '~/systems/Core/utils/database';
import { captureException } from '~/systems/Error/utils/captureException';
import { getErrorIgnoreData } from '~/systems/Error/utils/getErrorIgnoreData';
import { parseFuelError } from '../utils';

export class ReportErrorService {
  async reportErrors() {
    const errors = await this.getErrors();

    for (const e of errors) {
      // biome-ignore lint/suspicious/noExplicitAny: playwright is injected late into the window context
      if (typeof window !== 'undefined' && (window as any).playwright) {
        return;
      }
      captureException(e.error, e.extra);
    }
  }

  static async saveError(error: Error) {
    try {
      const parsedError = parseFuelError(error);
      const ignoreData = getErrorIgnoreData(parsedError?.error);
      if (!parsedError) {
        console.warn(`Can't save error without a message`);
        return;
      }
      if (!('id' in parsedError)) {
        console.warn(`Can't save error without an id`);
        return;
      }
      if (ignoreData?.action === 'ignore') return;
      if (ignoreData?.action === 'hide') {
        // Directly report to Sentry and exit
        captureException(parsedError.error, parsedError.extra);
        return;
      }
      if (!db.isOpen() || db.hasBeenClosed()) {
        console.warn('Error saving error: db is closed');
        return;
      }
      return await db.errors.add(parsedError);
    } catch (e) {
      console.warn('Failed to save error', e);
    }
  }

  async checkForErrors(): Promise<boolean> {
    const errors = await this.getErrors();
    return (
      errors.filter((e) => !getErrorIgnoreData(e?.error)?.action).length > 0
    );
  }

  async getErrors(): Promise<StoredFuelWalletError[]> {
    return await db.errors.toArray();
  }

  async clearErrors() {
    await db.errors.clear();
  }

  async handleAndRemoveOldIgnoredErrors(errors: StoredFuelWalletError[]) {
    const errorsBeingRemoved: Array<Promise<unknown>> = [];
    // Convert to for of
    for (const e of errors) {
      const errorIgnoreData = getErrorIgnoreData(e?.error);
      if (errorIgnoreData?.action) {
        errorsBeingRemoved.push(
          new Promise((resolve) => {
            if (errorIgnoreData?.action === 'hide') {
              captureException(e.error, e.extra);
            }
            return resolve(
              this.dismissError(e.id).finally(() => resolve(true))
            );
          })
        );
      }
    }
    await Promise.all(errorsBeingRemoved);
  }

  async dismissError(key: string) {
    if (!key) return;
    db.errors.delete(key);
  }
}
