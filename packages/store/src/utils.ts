export function get<T extends object>(path: string, obj: T) {
  const arr = path.split('.');
  return arr.reduce((val, key) => val?.[key], obj);
}
