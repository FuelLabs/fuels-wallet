function ensureError(error: Error | string): Error {
  if (error instanceof Error) return error;
  return new Error(error);
}

function getGlobalThis() {
  if (typeof window !== 'undefined') {
    return window;
  }
  return globalThis;
}

export function listenToGlobalErrors(onError: (error: Error) => void) {
  getGlobalThis().addEventListener('error', (event) => {
    if (!event?.error) return;
    onError(ensureError(event.error));
  });

  getGlobalThis().addEventListener('unhandledrejection', (event) => {
    if (!event?.reason) return;
    onError(ensureError(event.reason));
  });

  const originalConsoleError = console.error;
  console.error = (...args) => {
    try {
      onError(ensureError(args[0]));
    } catch (_) {
      console.warn('Avoided infinite console error loop.');
    }
    originalConsoleError.apply(console, args);
  };
}
