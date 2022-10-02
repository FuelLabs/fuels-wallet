/* eslint-disable @typescript-eslint/no-explicit-any */
import qs from 'query-string';

export class Route<P extends string> {
  path!: string;
  constructor(path: string) {
    this.path = path;
  }

  public get params(): Record<P, any> {
    const matches = Array.from(this.path.matchAll(/:([^/]+)/g));
    return matches.reduce(
      (obj, match) => ({ ...obj, [match[1]]: null }),
      {}
    ) as Record<P, any>;
  }
}

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
export function route<P extends string = any>(path: string) {
  const item = new Route<P>(path);
  return function parse(
    params?: Record<P, any>,
    query?: Record<string, any>
  ): string {
    const split = item.path.match(/[^/]+/g);
    const val = split
      ?.map((str) => params?.[str.replace(':', '')] || str)
      .join('/');
    const url = `/${val ?? ''}`;
    return qs.stringifyUrl({ url, query });
  };
}
