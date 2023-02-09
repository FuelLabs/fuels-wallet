/* eslint-disable consistent-return */
import { bn } from 'fuels';
import { useEffect, useRef } from 'react';

import type { AccountsMachineState } from '../machines';

import { store, Services } from '~/store';

enum AccountStatus {
  idle = 'idle',
  loading = 'loading',
  unlocking = 'unlocking',
  unlockingLoading = 'unlockingLoading',
}

const selectors = {
  hasBalance(state: AccountsMachineState) {
    const acc = state.context?.account;
    return bn(acc?.balance ?? 0).gt(0);
  },
  isUnlockingLoading: (state: AccountsMachineState) => {
    return state.children.unlock?.state.matches('unlockingVault');
  },
  status(state: AccountsMachineState) {
    if (state.hasTag('loading')) return AccountStatus.loading;
    if (state.matches('unlocking')) return AccountStatus.unlocking;
    if (selectors.isUnlockingLoading(state)) {
      return AccountStatus.unlockingLoading;
    }
    return AccountStatus.idle;
  },
  context(state: AccountsMachineState) {
    return state.context;
  },
  account(state: AccountsMachineState) {
    return state.context.account;
  },
};

const listenerAccountFetcher = () => {
  store.send(Services.accounts, {
    type: 'UPDATE_ACCOUNT',
  });
};

export function useAccounts() {
  const shouldListen = useRef(true);
  const hasBalance = store.useSelector(Services.accounts, selectors.hasBalance);
  const accountStatus = store.useSelector(Services.accounts, selectors.status);
  const ctx = store.useSelector(Services.accounts, selectors.context);
  const account = store.useSelector(Services.accounts, selectors.account);

  function unlock(password: string) {
    store.send(Services.accounts, {
      type: 'UNLOCK_VAULT',
      input: { password },
    });
  }

  function closeUnlock() {
    store.send(Services.accounts, {
      type: 'CLOSE_UNLOCK',
    });
  }

  function status(status: keyof typeof AccountStatus) {
    return accountStatus === status;
  }

  store.useUpdateMachineConfig(Services.accounts, {
    actions: {
      refreshApplication() {
        window.location.reload();
      },
    },
  });

  useEffect(() => {
    if (shouldListen.current) {
      shouldListen.current = false;
      window.addEventListener('focus', listenerAccountFetcher);
      return () => {
        window.removeEventListener('focus', listenerAccountFetcher);
      };
    }
  }, []);

  return {
    ...ctx,
    account,
    status,
    hasBalance,
    isLoading: status('loading'),
    handlers: {
      unlock,
      closeUnlock,
      addAccount: store.addAccount,
      goToAdd: store.openAccountsAdd,
      goToList: store.openAccountList,
      hideAccount: store.hideAccount,
      logout: store.logout,
      setCurrentAccount: store.setCurrentAccount,
    },
  };
}
