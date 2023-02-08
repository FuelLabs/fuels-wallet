import type { Account } from '@fuel-wallet/types';
import type { StoreClass } from '@fuel-wallet/xstore';

import { AccountScreen } from './machines';
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
    logout() {
      store.send(Services.accounts, {
        type: 'LOGOUT',
      });
    },
  };
}

export function accountDialogEvents(store: StoreClass<StoreMachines>) {
  return {
    openAccountsModal() {
      store.send(Services.accountsDialog, {
        type: 'OPEN_MODAL',
      });
    },
    closeAccountsModal() {
      store.send(Services.accountsDialog, {
        type: 'CLOSE_MODAL',
      });
    },
    viewAccountsList() {
      store.send(Services.accountsDialog, {
        type: 'GO_TO',
        input: AccountScreen.list,
      });
    },
    viewAccountsAdd() {
      store.send(Services.accountsDialog, {
        type: 'GO_TO',
        input: AccountScreen.add,
      });
    },
    viewAccountsLogout() {
      store.send(Services.accountsDialog, {
        type: 'GO_TO',
        input: AccountScreen.logout,
      });
    },
  };
}
