import type { Account } from '@fuel-wallet/types';
import type { Store } from '~/store';
import { Services } from '~/store';

export function accountEvents(store: Store) {
  return {
    reloadBalance() {
      store.send(Services.accounts, { type: 'RELOAD_BALANCE' });
    },
    updateAccounts() {
      store.send(Services.accounts, { type: 'REFRESH_ACCOUNTS' });
    },
    setCurrentAccount(account: Account) {
      store.send(Services.accounts, {
        type: 'SET_CURRENT_ACCOUNT',
        input: { address: account.address },
      });
    },
    logout() {
      store.send(Services.accounts, {
        type: 'LOGOUT',
      });
    },
    toggleHideAccount(address: string, isHidden: boolean) {
      store.send(Services.accounts, {
        type: 'TOGGLE_HIDE_ACCOUNT',
        input: {
          address,
          data: { isHidden },
        },
      });
    },
  };
}
