import type { Account } from '@fuel-wallet/types';
import type { StoreClass } from '@fuel-wallet/xstore';

import type { UnlockHandlers } from './machines';
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
    addAccount(input: string) {
      store.send(Services.accounts, { type: 'ADD_ACCOUNT', input });
    },
  };
}

export function unlockEvents(store: StoreClass<StoreMachines>) {
  return {
    unlock(input: UnlockHandlers) {
      store.send(Services.unlock, { type: 'OPEN_UNLOCK', input });
    },
    closeUnlock() {
      store.send(Services.unlock, { type: 'CLOSE_UNLOCK' });
    },
    resetUnlock() {
      store.send(Services.unlock, { type: 'RESET_UNLOCK' });
    },
  };
}
