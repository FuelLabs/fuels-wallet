/* eslint-disable @typescript-eslint/no-explicit-any */
export type DefferPromise<R = unknown> = {
  promise: Promise<R>;
  resolve: (value: R) => void;
  reject: (error: unknown) => void;
};

export function defferPromise<R = unknown>() {
  const deffer: DefferPromise<R> = {} as any;

  deffer.promise = new Promise((resolve, reject) => {
    deffer.reject = reject;
    deffer.resolve = resolve;
  });

  return deffer;
}
