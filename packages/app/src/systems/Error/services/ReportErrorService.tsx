import type { StoredFuelWalletError } from '@fuel-wallet/types';
import * as Sentry from '@sentry/react';
import { db } from '~/systems/Core/utils/database';
import { parseFuelError } from '../utils';

export class ReportErrorService {
  async reportErrors() {
    const errors = await this.getErrors();

    for (const e of errors) {
      Sentry.captureException(e.error, {
        extra: e.extra,
        tags: { id: e.id, manual: true },
      });
    }
  }

  static saveError(error: Error) {
    const parsedError = parseFuelError(error);
    if (!parsedError) {
      console.warn(`Can't save error without a message`);
      return;
    }
    if (!('id' in parsedError)) {
      console.warn(`Can't save error without an id`);
      return;
    }
    return db.errors.add(parsedError);
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

  async dismissError(index: number) {
    const errors = await this.getErrors();
    if (index >= 0 && index < errors.length) {
      errors.splice(index, 1);
      await db.errors.clear();
      for (const error of errors) {
        await db.errors.add(error);
      }
    }
  }
}
