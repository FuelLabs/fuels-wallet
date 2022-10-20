const DELIMITER_PATH = '/';
const trimRegex = /^\/|\/$/g;
const trimPath = (path = '') => path.replace(trimRegex, '');
const trimPathNotFirst = (path: string = '', index?: number) =>
  index === 0 ? path : path.replace(trimRegex, '');

export function urlJoin(
  baseUrl: string | undefined,
  ...paths: Array<string>
): string {
  const hasBaseUrl = baseUrl !== null && baseUrl !== undefined;
  return [baseUrl, ...paths]
    .filter(Boolean)
    .map(hasBaseUrl ? trimPath : trimPathNotFirst)
    .join(DELIMITER_PATH);
}

export function relativeUrl(path: string) {
  return urlJoin(import.meta.env.BASE_URL, path);
}

export function parseUrl(url: string) {
  return url.replace(/http(s?):\/\//, '');
}
