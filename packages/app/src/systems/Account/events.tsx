import type { Account } from '@fuel-wallet/types';

import type { AccountInputs } from './services';

import type { Store } from '~/store';
import { Services } from '~/store';

export function accountEvents(store: Store) {
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
    setCurrentAccount(account: Account) {
      store.send(Services.accounts, {
        type: 'SET_CURRENT_ACCOUNT',
        input: { address: account.address },
      });
    },
    addAccount(input: string) {
      store.send(Services.accounts, {
        type: 'ADD_ACCOUNT',
        input,
      });
    },
    importAccount(input: AccountInputs['importAccount']) {
      store.send(Services.accounts, {
        type: 'IMPORT_ACCOUNT',
        input,
      });
    },
    logout() {
      store.send(Services.accounts, {
        type: 'LOGOUT',
      });
    },
  };
}
