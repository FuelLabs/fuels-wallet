export function joinUrl(...parts: Array<string>) {
  const separator = '/';
  const replace = new RegExp(`${separator}{1,}`, 'g');
  return parts.join(separator).replace(replace, separator);
}

export function relativeUrl(path: string) {
  return joinUrl(import.meta.env.BASE_URL, path);
}

export function parseUrl(url: string) {
  return url.replace(/http(s?):\/\//, '');
}
