/* eslint-disable @typescript-eslint/no-explicit-any */
export type DeferPromise<R = unknown> = {
  promise: Promise<R>;
  resolve: (value: R) => void;
  reject: (error: unknown) => void;
};

export type DeferPromiseWithTimeout<R = unknown> = {
  promise: Promise<R>;
  resolve: (value: R) => void;
  reject: (error: unknown) => void;
  isResolved: boolean;
};

export function deferPromise<R = unknown>() {
  const defer: DeferPromise<R> = {} as any;

  defer.promise = new Promise((resolve, reject) => {
    defer.reject = reject;
    defer.resolve = resolve;
  });

  return defer;
}

export function deferPromiseWithTimeout<R = unknown>(
  timeout: number = 1000,
  onTimeout: () => void
) {
  const defer: DeferPromiseWithTimeout<R> = {
    isResolved: false,
  } as any;

  defer.promise = new Promise((resolve, reject) => {
    const timer = setTimeout(onTimeout, timeout);
    defer.reject = (...arg) => {
      defer.isResolved = true;
      clearTimeout(timer);
      reject(...arg);
    };
    defer.resolve = (...arg) => {
      defer.isResolved = true;
      clearTimeout(timer);
      resolve(...arg);
    };
  });

  return defer;
}
