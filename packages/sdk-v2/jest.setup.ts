import { TextEncoder, TextDecoder } from 'util';

// https://stackoverflow.com/a/68468204
Object.assign(global, { TextDecoder, TextEncoder });

// This is needed bc of this error https://github.com/jestjs/jest/issues/2549
Object.defineProperty(Uint8Array, Symbol.hasInstance, {
  value(potentialInstance: unknown) {
    return this === Uint8Array
      ? Object.prototype.toString.call(potentialInstance) ===
          '[object Uint8Array]'
      : Uint8Array[Symbol.hasInstance].call(this, potentialInstance);
  },
});
