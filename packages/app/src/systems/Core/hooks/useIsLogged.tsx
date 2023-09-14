import { IS_LOGGED_KEY } from '~/config';

import { Storage } from '../utils';

export function useIsLogged() {
  return !!Storage.getItem(IS_LOGGED_KEY);
}
