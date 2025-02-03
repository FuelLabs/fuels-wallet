// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { webcrypto } from 'crypto';
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { TextDecoder, TextEncoder } from 'util';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
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

// Initialize the MSW server with the necessary request handlers
const server = setupServer(
  rest.get('/assets.json', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          name: 'Ethereum',
          symbol: 'ETH',
          icon: 'https://verified-assets.fuel.network/images/eth.svg',
          networks: [
            {
              type: 'ethereum',
              chain: 'sepolia',
              decimals: 18,
              chainId: 11155111,
            },
            {
              type: 'ethereum',
              chain: 'foundry',
              decimals: 18,
              chainId: 31337,
            },
            {
              type: 'ethereum',
              chain: 'mainnet',
              decimals: 18,
              chainId: 1,
            },
            {
              type: 'fuel',
              chain: 'devnet',
              decimals: 9,
              assetId:
                '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07',
              chainId: 0,
            },
            {
              type: 'fuel',
              chain: 'testnet',
              decimals: 9,
              assetId:
                '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07',
              chainId: 0,
            },
            {
              type: 'fuel',
              chain: 'mainnet',
              decimals: 9,
              assetId:
                '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07',
              chainId: 9889,
            },
          ],
        },
        {
          name: 'Fuel',
          symbol: 'FUEL',
          icon: 'https://verified-assets.fuel.network/images/fuel.svg',
          networks: [
            {
              type: 'ethereum',
              chain: 'sepolia',
              address: '0xd7fc4e8fb2c05567c313f4c9b9e07641a361a550',
              decimals: 9,
              chainId: 11155111,
            },
            {
              type: 'ethereum',
              chain: 'mainnet',
              address: '0x675b68aa4d9c2d3bb3f0397048e62e6b7192079c',
              decimals: 9,
              chainId: 1,
            },
            {
              type: 'fuel',
              chain: 'testnet',
              decimals: 9,
              chainId: 0,
              contractId:
                '0xd02112ef9c39f1cea7c8527c26242ca1f5d26bcfe8d1564bee054d3b04175471',
              subId:
                '0xede43647e2aad1c0f1696201d6ba913aa67c917c3ac9a4a7d95662962ab25c5b',
              assetId:
                '0x324d0c35a4299ef88138a656d5272c5a3a9ccde2630ae055dacaf9d13443d53b',
            },
            {
              type: 'fuel',
              chain: 'mainnet',
              decimals: 9,
              chainId: 9889,
              contractId:
                '0x4ea6ccef1215d9479f1024dff70fc055ca538215d2c8c348beddffd54583d0e8',
              subId:
                '0xe81c89b8cf795c7c25e79f6c4f2f1cd233290b58e217ed4e9b6b18538badddaf',
              assetId:
                '0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82',
            },
          ],
        },
      ])
    );
  })
);

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that are declared as a part of our tests (i.e., for testing one-time error scenarios)
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

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
