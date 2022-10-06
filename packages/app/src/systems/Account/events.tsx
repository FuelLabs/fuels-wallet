import type { StoreClass } from '@fuels-wallet/xstore';

import type { StoreMachines } from '~/store';
import { Services } from '~/store';

export function accountEvents(store: StoreClass<StoreMachines>) {
  return {
    updateAccounts() {
      store.send(Services.account, { type: 'UPDATE_ACCOUNT' });
    },
  };
}
