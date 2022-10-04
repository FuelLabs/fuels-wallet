import { IS_LOGGED_KEY } from '~/config';

export function useIsLogged() {
  return localStorage.getItem(IS_LOGGED_KEY) === 'true';
}
