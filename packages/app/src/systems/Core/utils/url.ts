import { urlJoin } from 'url-join-ts';

export const joinUrl = urlJoin;

export function relativeUrl(path: string) {
  return joinUrl(import.meta.env.BASE_URL, path);
}

export function parseUrl(url: string) {
  return url.replace(/http(s?):\/\//, '');
}
