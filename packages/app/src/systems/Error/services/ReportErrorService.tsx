import type { StoredFuelWalletError } from '@fuel-wallet/types';
import * as Sentry from '@sentry/react';
import { db } from '~/systems/Core/utils/database';
import { parseFuelError } from '../utils';

export class ReportErrorService {
  async reportErrors() {
    const errors = await this.getErrors();

    for (const e of errors) {
      // biome-ignore lint/suspicious/noExplicitAny: playwright is injected late into the window context
      if (typeof window !== 'undefined' && (window as any).playwright) {
        return;
      }
      Sentry.captureException(e.error, {
        extra: e.extra,
        tags: { id: e.id, manual: true },
      });
    }
  }

  static async saveError(error: Error) {
    const parsedError = parseFuelError(error);
    if (!parsedError) {
      console.warn(`Can't save error without a message`);
      return;
    }
    if (!('id' in parsedError)) {
      console.warn(`Can't save error without an id`);
      return;
    }
    if (!db.isOpen() || db.hasBeenClosed()) {
      console.warn('Error saving error: db is closed');
      return;
    }

    try {
      return await db.errors.add(parsedError);
    } catch (e) {
      console.warn('Failed to save error', e);
    }
  }

  async checkForErrors(): Promise<boolean> {
    const errors = await this.getErrors();
    return errors.length > 0;
  }

  async getErrors(): Promise<StoredFuelWalletError[]> {
    return db.errors.toArray();
  }

  async clearErrors() {
    await db.errors.clear();
  }

  async dismissError(key: string) {
    if (!key) return;
    db.errors.delete(key);
  }
}
