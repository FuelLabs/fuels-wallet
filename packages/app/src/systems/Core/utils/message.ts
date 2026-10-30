import type { HashableMessage } from 'fuels';
import { arrayify, hexlify } from 'fuels';

const strictUtf8 = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true });
const HIDDEN_CHARACTER = /[\p{Cc}\p{Cf}\p{Co}\p{Cn}\p{Zl}\p{Zp}\p{Zs}⟨]/u;
const SHOWN_AS_IS = ['\n', '\t', ' '];
const ZERO_WIDTH_JOINER = '\u200D';
export const HIDDEN_CHARACTER_MARKER = /(⟨U\+[0-9A-F]{4,6}⟩)/;
const EMOJI = /\p{Extended_Pictographic}/u;
const EMOJI_END = /^(?:\p{Extended_Pictographic}|\p{Emoji_Modifier}|\uFE0F)$/u;

export function personalSignBytes(personalSign: string): Uint8Array {
  return personalSign.startsWith('0x')
    ? arrayify(personalSign)
    : new TextEncoder().encode(personalSign);
}

// ⟨ is marked too, so a marker always stands for a real hidden character
function markHiddenCharacters(text: string): string {
  const chars = Array.from(text);
  return chars
    .map((char, i) => {
      const joinsEmoji =
        char === ZERO_WIDTH_JOINER &&
        EMOJI_END.test(chars[i - 1] ?? '') &&
        EMOJI.test(chars[i + 1] ?? '');
      if (
        !HIDDEN_CHARACTER.test(char) ||
        SHOWN_AS_IS.includes(char) ||
        joinsEmoji
      ) {
        return char;
      }
      const codePoint = char.codePointAt(0)?.toString(16).toUpperCase();
      return `⟨U+${codePoint?.padStart(4, '0')}⟩`;
    })
    .join('');
}

function bytesToDisplay(bytes: Uint8Array): string {
  try {
    return markHiddenCharacters(strictUtf8.decode(bytes));
  } catch {
    return hexlify(bytes);
  }
}

export function formatMessage(message: HashableMessage): {
  formattedMessage: string;
  isValid: boolean;
} {
  if (!message) {
    return { formattedMessage: 'No message provided', isValid: false };
  }
  if (typeof message === 'string') {
    return {
      formattedMessage: bytesToDisplay(new TextEncoder().encode(message)),
      isValid: true,
    };
  }
  if (typeof message?.personalSign === 'string') {
    try {
      const bytes = personalSignBytes(message.personalSign);
      if (!bytes.length) {
        return { formattedMessage: 'No message provided', isValid: false };
      }
      return { formattedMessage: bytesToDisplay(bytes), isValid: true };
    } catch {}
  }
  return { formattedMessage: 'Invalid message format', isValid: false };
}
