/* eslint-disable @typescript-eslint/no-explicit-any */
import { webcrypto } from 'crypto';
import failOnConsole from 'jest-fail-on-console';
import { TextEncoder, TextDecoder } from 'util';

import { localStorageMock } from './src/mocks/localStorage';

(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
(global as any).ArrayBuffer = ArrayBuffer;
(global as any).Uint8Array = Uint8Array;
(global as any).structuredClone = (val: any) => JSON.parse(JSON.stringify(val));

const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
Object.defineProperty(window, 'crypto', { value: webcrypto });

if (process.env.CI) {
  // If test fails retry it until success
  jest.retryTimes(3, {
    logErrorsBeforeRetry: true,
  });
}

failOnConsole({
  shouldFailOnWarn: false,
  silenceMessage: (errorMessage: string) => {
    if (/Warning: React does not recognize the/i.test(errorMessage)) {
      return true;
    }
    return false;
  },
});
