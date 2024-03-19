import { ReportErrorService } from '~/systems/Error/services';

globalThis.addEventListener('error', (event) => {
  if (typeof window !== 'undefined') return;
  if (!event?.error) return;
  ReportErrorService.saveError({
    error: {
      message: event?.error?.message,
      stack: event?.error?.stack,
    },
  });
});

export function errorBoundary<T extends () => ReturnType<T>>(
  cb: T
): ReturnType<T> {
  try {
    return cb();
  } catch (err) {
    ReportErrorService.saveError({
      error: err as Error,
    });
    throw err;
  }
}
