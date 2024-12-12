// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { webcrypto } from 'crypto';
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { TextDecoder, TextEncoder } from 'util';

import { localStorageMock } from './src/mocks/localStorage';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
(global as any).TextEncoder = TextEncoder;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
(global as any).TextDecoder = TextDecoder;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
(global as any).ArrayBuffer = ArrayBuffer;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
(global as any).Uint8Array = Uint8Array;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
(global as any).structuredClone = (val: any) => JSON.parse(JSON.stringify(val));

// https://github.com/jsdom/jsdom/issues/1724#issuecomment-720727999
import 'whatwg-fetch';

import { act } from 'react';

// Replace ReactDOMTestUtils.act with React.act
jest.mock('react-dom/test-utils', () => {
  const originalModule = jest.requireActual('react-dom/test-utils');
  return {
    ...originalModule,
    act: act,
  };
});

// Replace chromeStorage
jest.mock('./src/systems/Core/services/chromeStorage', () => {
  return {
    chromeStorage: {
      accounts: {
        get: jest.fn(),
        getAll: jest.fn(),
        set: jest.fn(),
        remove: jest.fn(),
        clear: jest.fn(),
      },
      networks: {
        get: jest.fn(),
        getAll: jest.fn(),
        set: jest.fn(),
        remove: jest.fn(),
        clear: jest.fn(),
      },
      vaults: {
        get: jest.fn(),
        getAll: jest.fn(),
        set: jest.fn(),
        remove: jest.fn(),
        clear: jest.fn(),
      },
    },
  };
});

console.warn = jest.fn();

const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
Object.defineProperty(window, 'crypto', { value: webcrypto });
// This is needed bc of this error https://github.com/jestjs/jest/issues/2549
Object.defineProperty(Uint8Array, Symbol.hasInstance, {
  value(potentialInstance: unknown) {
    return this === Uint8Array
      ? Object.prototype.toString.call(potentialInstance) ===
          '[object Uint8Array]'
      : Uint8Array[Symbol.hasInstance].call(this, potentialInstance);
  },
});

if (process.env.CI) {
  // If test fails retry it until success
  jest.retryTimes(3, {
    logErrorsBeforeRetry: true,
  });
}

const _mockNetworks = [
  {
    asset_id: 'TKN',
    name: 'Token',
    type: 'token',
    symbol: 'TKN',
    decimals: 9,
  },
  {
    asset_id: 'ETH',
    name: 'Ethereum',
    type: 'token',
    symbol: 'ETH',
    decimals: 18,
  },
  {
    asset_id: 'Fuel',
    name: 'Fuel',
    type: 'token',
    symbol: 'Fuel',
    decimals: 9,
  },
];
