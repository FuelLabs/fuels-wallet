/* eslint-disable import/order */
import { performance } from 'node:perf_hooks';
import { clearImmediate } from 'node:timers';
import { TextDecoder, TextEncoder } from 'node:util';
import { ReadableStream } from 'web-streams-polyfill';

// https://stackoverflow.com/a/68468204
Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  performance: { value: performance },
  clearImmediate: { value: clearImmediate },
  ReadableStream: { value: ReadableStream },
});

import { Blob, File } from 'node:buffer';
import { fetch, Headers, FormData, Request, Response } from 'undici';

Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true },
  Blob: { value: Blob },
  File: { value: File },
  Headers: { value: Headers },
  FormData: { value: FormData },
  Request: { value: Request },
  Response: { value: Response },
});

Object.defineProperty(Uint8Array, Symbol.hasInstance, {
  value(potentialInstance: unknown) {
    return this === Uint8Array
      ? Object.prototype.toString.call(potentialInstance) ===
          '[object Uint8Array]'
      : Uint8Array[Symbol.hasInstance].call(this, potentialInstance);
  },
});
