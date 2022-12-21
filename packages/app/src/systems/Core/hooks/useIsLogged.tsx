import { Storage } from '../utils';

import { IS_LOGGED_KEY } from '~/config';

export function useIsLogged() {
  return !!Storage.getItem(IS_LOGGED_KEY);
}
