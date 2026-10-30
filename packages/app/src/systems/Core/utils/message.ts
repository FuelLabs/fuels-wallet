import type { HashableMessage } from 'fuels';
import { arrayify, hexlify } from 'fuels';

const utf8 = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true });
const HIDDEN_CHARACTERS = /[\p{Cc}\p{Cf}\p{Co}\p{Cn}\p{Zl}\p{Zp}]/u;
const ALLOWED_CONTROLS = /[\n\r\t]/g;

export function personalSignBytes(personalSign: string): Uint8Array {
  return personalSign.startsWith('0x')
    ? arrayify(personalSign)
    : new TextEncoder().encode(personalSign);
}

function bytesToDisplay(bytes: Uint8Array): string {
  try {
    const text = utf8.decode(bytes);
    if (!HIDDEN_CHARACTERS.test(text.replace(ALLOWED_CONTROLS, ''))) {
      return text;
    }
  } catch {}
  return hexlify(bytes);
}

export function formatMessage(message: HashableMessage): {
  formattedMessage: string;
  isValid: boolean;
} {
  if (!message) {
    return { formattedMessage: 'No message provided', isValid: false };
  }
  if (typeof message === 'string') {
    return { formattedMessage: message, isValid: true };
  }
  if (typeof message?.personalSign === 'string') {
    try {
      return {
        formattedMessage: bytesToDisplay(
          personalSignBytes(message.personalSign)
        ),
        isValid: true,
      };
    } catch {}
  }
  return { formattedMessage: 'Invalid message format', isValid: false };
}
