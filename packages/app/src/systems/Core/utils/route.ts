/**
 * Create a route that can be parsed using a typed-obj as param
 *
 * @typeParam P - list of keys accepted as params
 * @param path - raw route path
 * @returns a strong-typed function to parse the route using object, if any
 * param is passed, returns the path itself without parsing
 *
 * @example
 * Example using typed params
 * ```js
 * const userUpdate = route<'id'>('/user/:id')
 * userUpdate({ id: 1 }) // /user/1
 * ```
 * @example
 * Using a wrong parameter
 * ```js
 * const userUpdate = route<'id'>('/user/:id')
 * userUpdate({ test: 1 })
 *              ^^ 'test' does not exist in type 'Record<"id", any>'.
 * ```
 */
export function route<P extends string>(path: string) {
  return function parse(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    params?: Record<P, any>,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    query?: Record<string, any>
  ): string {
    const split = path.match(/[^/]+/g);
    const parsed = split
      ?.map((str) => params?.[str.replace(':', '')] || str)
      .join('/');

    return `/${parsed ?? ''}${searchStringify(query)}`;
  };
}

/**
 * Converts an object into a query string.
 *
 * @param query An object to convert into a query string.
 * @returns A query string.
 *
 * @example
 * searchStringify({ foo: 'bar', baz: 'qux' });
 * // returns '?foo=bar&baz=qux'
 */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function searchStringify(query?: Record<any, any>) {
  const qs = new URLSearchParams(query).toString();
  return qs.length ? `?${qs}` : '';
}

/**
 * Converts a URL and an optional query object into a full URL string.
 *
 * @param url A URL.
 * @param query An optional object to convert into a query string and append to the URL.
 * @returns A full URL string.
 *
 * @example
 * stringifyUrl('https://example.com', { foo: 'bar', baz: 'qux' });
 * // returns 'https://example.com/?foo=bar&baz=qux'
 */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function stringifyUrl(url: string, query?: Record<any, any>) {
  const { href } = new URL(url, 'https://fuel.network/');
  return `${href}${searchStringify(query)}`;
}
