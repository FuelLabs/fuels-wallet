/* eslint-disable consistent-return */
import { bn } from 'fuels';
import { useEffect, useRef } from 'react';

import type {
  AccountsDialogMachineState,
  AccountsMachineState,
} from '../machines';

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
  screen(state: AccountsDialogMachineState) {
    return state.context.screen;
  },
  isOpened(state: AccountsDialogMachineState) {
    return !state.matches('closed');
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
  const screen = store.useSelector(Services.accountsDialog, selectors.screen);
  const account = store.useSelector(Services.accounts, selectors.account);
  const isOpened = store.useSelector(
    Services.accountsDialog,
    selectors.isOpened
  );

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
      redirectToHome() {
        store.send(Services.accountsDialog, {
          type: 'CLOSE_MODAL',
        });
      },
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
    screen,
    isOpened,
    hasBalance,
    isLoading: status('loading'),
    handlers: {
      unlock,
      closeUnlock,
      addAccount: store.addAccount,
      closeModal: store.closeAccountsModal,
      goToAdd: store.viewAccountsAdd,
      goToList: store.viewAccountsList,
      hideAccount: store.hideAccount,
      logout: store.viewAccountsLogout,
      setCurrentAccount: store.setCurrentAccount,
    },
  };
}
