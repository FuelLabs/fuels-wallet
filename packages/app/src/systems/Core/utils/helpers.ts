/* eslint-disable @typescript-eslint/no-explicit-any */
type Dictionary<T = unknown> = Record<string, T>;

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Check if a value is primitive.
 *
 * @param value - The value to check.
 * @returns `true` if the value is primitive, `false` otherwise.
 *
 * @example
 * isPrimitive("Hello, world!"); // returns: true
 * isPrimitive(12345); // returns: true
 * isPrimitive(true); // returns: true
 * isPrimitive(Symbol("my symbol")); // returns: true
 * isPrimitive(null); // returns: true
 * isPrimitive(undefined); // returns: true
 * isPrimitive({}); // returns: false
 * isPrimitive([]); // returns: false
 */
export function isPrimitive<T>(value: T) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'symbol' ||
    value === null ||
    value === undefined
  );
}

/**
 * Returns the value at a given path in an object, or a default value if the path does not exist.
 *
 * @param obj - The object to extract the value from.
 * @param path - The path to the value in the object, in the form of a dot-separated string.
 * @param defaultValue - The value to return if the path does not exist in the object.
 * @returns The value at the given path in the object, or the default value if the path does not exist.
 *
 * @example
 * const obj = {
 *   a: {
 *     b: 2
 *   }
 * };
 * pathOr(obj, 'a.b', 0); // returns 2
 * pathOr(obj, 'a.c', 0); // returns 0
 */
export function pathOr<T extends Dictionary, K extends keyof T>(
  obj: T,
  path: string,
  defaultValue: any = null
) {
  if (typeof path !== 'string') {
    throw new Error('Path must be a string');
  }
  const arr = path.split('.') as K[];
  return arr.reduce((a, b) => a?.[b] as any, obj) || defaultValue;
}

/**
 * Merges the properties of two objects together and returns a new object.
 * If the objects have the same property, the property in the second object
 * will override the property in the first object. If the property is an array,
 * the two arrays will be concatenated.
 *
 * @param a - The first object to merge.
 * @param b - The second object to merge.
 * @returns A new object with the properties of both objects.
 *
 * @example
 * const a = { a: 1, b: { c: 2 } };
 * const b = { b: { d: 3 }, e: 4 };
 *
 * const result = mergeRight(a, b);
 * // returns { a: 1, b: { c: 2, d: 3 }, e: 4 };
 */
export function mergeRight<T1 extends Dictionary, T2 extends Dictionary>(
  a: DeepPartial<T1>,
  b: DeepPartial<T2>
): DeepPartial<T1 & T2> {
  return Object.entries(b).reduce(
    (acc, [key, value]) => {
      const item = acc?.[key];
      if (Array.isArray(value) && Array.isArray(item)) {
        const arr = item as unknown[];
        return { ...acc, [key]: arr.concat(value) };
      }
      if (!isPrimitive(value) && !isPrimitive(item)) {
        const obj = item as Dictionary;
        return { ...acc, [key]: mergeRight(obj, value) };
      }
      return { ...acc, [key]: value };
    },
    { ...a } as DeepPartial<T1 & T2>
  );
}

/**
 * @template T, U
 * @param {T} obj - The object to set the value on.
 * @param {string} path - The path to the property to set in the object,
 *                        separated by dots.
 * @param {U} val - The value to set at the specified path in the object.
 * @returns {T} A new object with the value set at the specified path.
 *
 * @example
 *
 * const person = {
 *   name: 'John Doe',
 *   address: {
 *     street: 'Main St.',
 *     city: 'New York',
 *   },
 * };
 *
 * const updated = assocPath(person, 'address.city', 'Boston');
 * // {
 * //   name: 'John Doe',
 * //   address: {
 * //     street: 'Main St.',
 * //     city: 'Boston',
 * //   },
 * // }
 */
export function assocPath<T, U>(obj: T, path: string, val: U): T {
  if (typeof path !== 'string') {
    throw new Error('Path must be a string');
  }
  if (!path.length) return obj;
  const list = path.split('.');
  const [prop, ...rest] = list;
  return list.length === 1
    ? { ...obj, [prop]: val }
    : { ...obj, [prop]: assocPath(obj?.[prop], rest.join('.'), val) };
}
