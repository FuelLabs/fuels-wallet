import { createUUID } from '@fuel-wallet/connections';

const SANITIZE_REGEXP = /private key: \w+/g;

export function parseFuelError(error: Error): Error {
  try {
    return {
      ...error,
      message: error.message.replace(SANITIZE_REGEXP, 'private key'),
      timestamp: Date.now(),
      id: createUUID(),
      location: window ? window.location.href : '-',
      pathname: window ? window.location.pathname : '-',
      hash: window ? window.location.hash : '-',
    } as Error;
  } catch (_) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return error as any;
  }
}
