import type { SentryExtraErrorData } from '@fuel-wallet/types';
import * as Sentry from '@sentry/react';

export function captureException(error: Error, extra: SentryExtraErrorData) {
  Sentry.captureException(error, {
    extra,
    tags: { manual: true },
  });
}
