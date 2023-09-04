import type { FuelWalletError } from '@fuel-wallet/types';
import * as Sentry from '@sentry/browser';
import { APP_VERSION, VITE_SENTRY_DSN } from '~/config';
import { db } from '~/systems/Core/utils/database';

import { createError, parseFuelError } from '../utils';

export class ReportErrorService {
  static async reportErrors() {
    const errors = await this.getErrors();
    Sentry.init({
      release: APP_VERSION,
      dsn: VITE_SENTRY_DSN,
      environment: process.env.NODE_ENV,
    });
    errors.forEach((e) => {
      Sentry.captureException(createError(e), {
        extra: e,
      });
    });
  }

  static saveError({
    error,
    reactError,
  }: Pick<FuelWalletError, 'error' | 'reactError'>) {
    const fuelError = parseFuelError({
      error: { ...error },
      reactError: { ...reactError },
    });
    return db.errors.add(fuelError);
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
}
