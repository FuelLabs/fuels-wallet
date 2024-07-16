function getGlobalThis() {
  if (typeof window !== 'undefined') {
    return window;
  }
  return globalThis;
}

export function listenToGlobalErrors(onError: (error: Error) => void) {
  getGlobalThis().addEventListener('error', (event) => {
    if (typeof window !== 'undefined') return;
    if (!event?.error) return;
    onError(event.error);
  });

  getGlobalThis().addEventListener('unhandledrejection', (event) => {
    if (typeof window !== 'undefined') return;
    if (!event?.reason) return;
    onError(event.reason);
  });

  const originalConsoleError = console.error;
  console.error = (...args) => {
    try {
      onError({
        message: args[0],
        stack: new Error().stack,
      } as Error);
    } catch (_) {
      console.warn('Avoided infinite console error loop.');
    }
    originalConsoleError.apply(console, args);
  };
}
