import type { StoreClass } from '@fuel-wallet/xstore';

import type { AccountInputs } from './services';

import type { StoreMachines } from '~/store';
import { Services } from '~/store';

export function accountEvents(store: StoreClass<StoreMachines>) {
  return {
    updateAccounts() {
      store.send(Services.account, { type: 'UPDATE_ACCOUNT' });
    },
    setBalanceVisibility(input: AccountInputs['setBalanceVisibility']) {
      store.send(Services.account, {
        type: 'SET_BALANCE_VISIBILITY',
        input,
      });
    },
  };
}
