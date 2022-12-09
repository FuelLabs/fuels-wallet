import type { Account } from '@fuel-wallet/types';
import type { StoreClass } from '@fuel-wallet/xstore';

import type { AccountInitialInput } from './machines';
import type { AccountInputs } from './services';

import type { StoreMachines } from '~/store';
import { Services } from '~/store';

export function accountEvents(store: StoreClass<StoreMachines>) {
  return {
    updateAccounts() {
      store.send(Services.accounts, { type: 'UPDATE_ACCOUNT' });
    },
    setBalanceVisibility(input: AccountInputs['setBalanceVisibility']) {
      store.send(Services.accounts, {
        type: 'SET_BALANCE_VISIBILITY',
        input,
      });
    },
    selectAccount(account: Account) {
      store.send(Services.accounts, {
        type: 'SELECT_ACCOUNT',
        input: { address: account.address },
      });
    },
    initAccounts(input: AccountInitialInput) {
      store.send(Services.accounts, {
        type: 'SET_INITIAL_DATA',
        input,
      });
    },
  };
}
