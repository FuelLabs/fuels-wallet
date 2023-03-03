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
    importAccount(privateKey: string) {
      store.send(Services.accounts, {
        type: 'IMPORT_ACCOUNT',
        input: { privateKey },
      });
    },
    logout() {
      store.send(Services.accounts, {
        type: 'LOGOUT',
      });
    },
    openAccountList() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: 'accounts.list',
      });
    },
    openAccountsAdd() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: 'accounts.add',
      });
    },
    openAccountImport() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: 'accounts.import',
      });
    },
    openAccountsLogout() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: 'accounts.logout',
      });
    },
    openNetworksList() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: 'networks.list',
      });
    },
    openNetworksAdd() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: 'networks.add',
      });
    },
  };
}
