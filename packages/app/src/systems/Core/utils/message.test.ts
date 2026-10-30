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

  it.each([
    ['invalid UTF-8', new Uint8Array([0x7b, 0xff, 0x7d])],
    ['a byte order mark', new Uint8Array([0xef, 0xbb, 0xbf, 0x41])],
    ['a control character', toUtf8Bytes('a\u0000b')],
    ['a right-to-left override', toUtf8Bytes('pay\u202Eevil')],
    ['a zero-width space', toUtf8Bytes('a\u200Bb')],
  ])('shows hex for bytes with %s', (_, bytes) => {
    expect(shown(bytes)).toBe(hexlify(bytes));
  });

  it('rejects messages it cannot read', () => {
    expect(formatMessage({ personalSign: '0x123' }).isValid).toBe(false);
    expect(formatMessage('' as never).isValid).toBe(false);
  });
});
