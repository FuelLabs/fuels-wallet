import { urlJoin } from 'url-join-ts';

export function relativeUrl(path: string) {
  return urlJoin(window.location.origin, import.meta.env.BASE_URL, path);
}
