function pathJoin(...parts: Array<string>) {
  const separator = '/';
  const replace = new RegExp(`${separator}{1,}`, 'g');
  return parts.join(separator).replace(replace, separator);
}

export function relativeUrl(path: string) {
  return pathJoin(window.location.origin, import.meta.env.BASE_URL, path);
}
