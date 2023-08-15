/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReportErrorService } from '~/systems/Error/services';

globalThis.addEventListener('unhandledrejection', (event) => {
  // Only report error if the window is undefined and the error occured in the
  // background script
  if (typeof window !== 'undefined') return;
  ReportErrorService.saveError({
    error: event.reason,
  });
});

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
