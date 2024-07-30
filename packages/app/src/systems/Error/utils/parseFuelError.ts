import { createUUID } from '@fuel-wallet/connections';

const SANITIZE_REGEXP = /private key: \w+/g;

function parseMessage(
  message: string | { name: string; message: string }
): string | { message: string } {
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

export function parseFuelError(error: Error): Error | undefined {
  try {
    const errorBase = {
      ...error,
      timestamp: Date.now(),
      id: createUUID(),
      location: window ? window.location.href : '-',
      pathname: window ? window.location.pathname : '-',
      hash: window ? window.location.hash : '-',
    };

    const sanitizedData = parseMessage(error.message);

    if (typeof sanitizedData === 'string') {
      return {
        ...errorBase,
        message: sanitizedData,
      } as Error;
    }

    if ('message' in sanitizedData) {
      return {
        ...errorBase,
        ...sanitizedData,
      } as Error;
    }

    console.warn(`Can't report an error without an message is not a string`);

    return undefined;
  } catch (parseError) {
    console.warn('Failed to parse error data', parseError);
  }
}
