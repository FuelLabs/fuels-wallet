import { hexlify, toUtf8Bytes } from 'fuels';
import { formatMessage, personalSignBytes } from './message';

function shown(bytes: Uint8Array) {
  return formatMessage({ personalSign: hexlify(bytes) }).formattedMessage;
}

describe('personalSignBytes', () => {
  it('reads 0x strings as bytes and other strings as UTF-8', () => {
    expect(Array.from(personalSignBytes('0x414243'))).toEqual([65, 66, 67]);
    expect(Array.from(personalSignBytes('ABC'))).toEqual([65, 66, 67]);
  });
});

describe('formatMessage', () => {
  it('shows plain string messages as they are', () => {
    expect(formatMessage('hello')).toEqual({
      formattedMessage: 'hello',
      isValid: true,
    });
  });

  it('shows UTF-8 bytes as the exact text they encode', () => {
    const json = '{"role":"admin","role":"user","amount":9007199254740993}';
    expect(shown(toUtf8Bytes(json))).toBe(json);
    expect(shown(toUtf8Bytes('{ "a" :\n\t"\\u0041" }'))).toBe(
      '{ "a" :\n\t"\\u0041" }'
    );
  });

  it('shows the text of a non-hex personalSign string', () => {
    expect(formatMessage({ personalSign: 'Sign in' }).formattedMessage).toBe(
      'Sign in'
    );
  });

  it('shows hex for bytes that are not valid UTF-8', () => {
    const bytes = new Uint8Array([0x7b, 0xff, 0x7d]);
    expect(shown(bytes)).toBe(hexlify(bytes));
  });

  it.each([
    ['a byte order mark', '\uFEFFA', '⟨U+FEFF⟩A'],
    ['a control character', 'a\u0000b\rc', 'a⟨U+0000⟩b⟨U+000D⟩c'],
    ['a right-to-left override', 'pay\u202Eevil', 'pay⟨U+202E⟩evil'],
    ['a zero-width space', 'a\u200Bb', 'a⟨U+200B⟩b'],
    ['a no-break space', 'a\u00A0b', 'a⟨U+00A0⟩b'],
    ['a line separator', 'a\u2028b', 'a⟨U+2028⟩b'],
    ['a zero-width joiner between letters', 'a\u200Db', 'a⟨U+200D⟩b'],
    ['a literal marker bracket', '⟨U+202E⟩', '⟨U+27E8⟩U+202E⟩'],
  ])('marks %s in text and bytes', (_, text, expected) => {
    expect(formatMessage(text).formattedMessage).toBe(expected);
    expect(shown(toUtf8Bytes(text))).toBe(expected);
  });

  it('keeps spaces, tabs, line breaks and emoji sequences as they are', () => {
    const text =
      'Sign in\n\tnow 👨\u200D👩\u200D👧 👩🏽\u200D💻 🏳\uFE0F\u200D🌈 日本';
    expect(formatMessage(text).formattedMessage).toBe(text);
  });

  it('shows a lone surrogate as the replacement character that is signed', () => {
    expect(formatMessage('a\uD800b').formattedMessage).toBe('a\uFFFDb');
  });

  it('rejects messages it cannot read', () => {
    expect(formatMessage({ personalSign: '0x123' }).isValid).toBe(false);
    expect(formatMessage('' as never).isValid).toBe(false);
  });
});
