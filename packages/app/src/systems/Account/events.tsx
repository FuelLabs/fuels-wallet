import type { Account } from '@fuel-wallet/types';
import type { StoreClass } from '@fuel-wallet/xstore';

import type { AccountInputs } from './services';

import type { StoreMachines } from '~/store';
import { Services } from '~/store';

export function accountEvents(store: StoreClass<StoreMachines>) {
  return {
    updateAccounts() {
      store.send(Services.accounts, { type: 'UPDATE_ACCOUNTS' });
    },
    hideAccount(input: AccountInputs['hideAccount']) {
      store.send(Services.accounts, {
        type: 'HIDE_ACCOUNT',
        input,
      });
    },
    selectAccount(account: Account) {
      store.send(Services.accounts, {
        type: 'SELECT_ACCOUNT',
        input: { address: account.address },
      });
    },
  };
}
