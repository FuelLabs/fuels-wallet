/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextEncoder, TextDecoder } from 'util';

import { localStorageMock } from './src/mocks/localStorage';

(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
(global as any).ArrayBuffer = ArrayBuffer;
(global as any).Uint8Array = Uint8Array;

const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
