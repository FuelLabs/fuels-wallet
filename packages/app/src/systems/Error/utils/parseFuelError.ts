import { createUUID } from '@fuel-wallet/connections';
import type {
  SentryExtraErrorData,
  StoredFuelWalletError,
} from '@fuel-wallet/types';

const SANITIZE_REGEXP = /private key: \w+/g;

function parseMessage(
  message: string | { name: string; message: string }
): string | { message: string; name?: string } {
  if (typeof message === 'string') {
    return message.replace(SANITIZE_REGEXP, 'private key');
  }
  if ('name' in message || 'message' in message) {
    const { message: previousMessage, ...rest } = message;
    return {
      message: previousMessage.replace(SANITIZE_REGEXP, 'private key'),
      ...rest,
    };
  }
  const fallback = (message as unknown)
    ?.toString()
    .replace(SANITIZE_REGEXP, 'private key');
  if (!fallback) {
    throw new Error('message is not a string');
  }
  return fallback;
}

export function parseFuelError(
  error: Error
): StoredFuelWalletError | undefined {
  try {
    const id = createUUID();
    const errorExtra: SentryExtraErrorData = {
      timestamp: Date.now(),
      location: window ? window.location.href : '-',
      pathname: window ? window.location.pathname : '-',
      hash: window ? window.location.hash : '-',
    };

    const sanitizedData = parseMessage(error.message);

    if (typeof sanitizedData === 'string') {
      error.name = error.name || error.message;
      error.message = sanitizedData;
      return { id, error, extra: { ...errorExtra } };
    }

    if ('message' in sanitizedData) {
      const { message, name, ...rest } = sanitizedData;
      // biome-ignore lint/suspicious/noExplicitAny: If undefined is replaced in Sentry with <unknown>
      error.name = (name || (error?.stack && message) || undefined) as any;
      error.message = message;
      return { id, error, extra: { ...errorExtra, ...rest } };
    }

    console.warn(`Can't report an error without an message is not a string`);

    return undefined;
  } catch (parseError) {
    console.warn('Failed to parse error data', parseError);
  }
}
