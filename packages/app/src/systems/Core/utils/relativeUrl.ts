import { joinUrl } from './joinUrl';

export function relativeUrl(path: string) {
  return joinUrl(import.meta.env.BASE_URL, path);
}
