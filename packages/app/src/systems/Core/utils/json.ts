export function reparse<V extends object>(v: V) {
  return JSON.parse(JSON.stringify(v));
}
