// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function errorBoundary<T extends () => any>(cb: T): ReturnType<T> {
  // eslint-disable-next-line no-useless-catch
  try {
    return cb();
  } catch (err) {
    throw err;
  }
}
