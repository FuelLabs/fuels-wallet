// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function errorBoundary<T extends () => any>(cb: T): ReturnType<T> {
  try {
    return cb();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    throw err;
  }
}
