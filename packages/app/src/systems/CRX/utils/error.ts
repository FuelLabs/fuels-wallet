/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReportErrorService } from '~/systems/Error/services';

globalThis.addEventListener('error', (event) => {
  if (typeof window !== 'undefined') return;
  if (!event?.error || !event?.message) return;
  ReportErrorService.saveError({
    error: {
      message: event?.error?.message || event.message,
      stack: event?.error?.stack,
    },
  });
});

export function errorBoundary<T extends () => any>(cb: T): ReturnType<T> {
  try {
    return cb();
  } catch (err) {
    ReportErrorService.saveError({
      error: err as Error,
    });
    throw err;
  }
}
