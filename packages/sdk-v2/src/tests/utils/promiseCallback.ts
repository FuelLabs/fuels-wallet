import type { DeferPromise } from '../../utils/promise';
import { deferPromise } from '../../utils/promise';

export type PromiseCallback = jest.Mock & {
  promise: DeferPromise;
};

export function promiseCallback() {
  const defer = deferPromise();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockFn: any = jest.fn();

  mockFn.mockImplementation((...args: unknown[]) => {
    defer.resolve(args);
  });
  mockFn.promise = defer.promise;

  return mockFn as PromiseCallback;
}
