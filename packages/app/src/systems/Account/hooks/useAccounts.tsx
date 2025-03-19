import { bn } from 'fuels';
import { useEffect, useRef } from 'react';
import { Services, store } from '~/store';
import { useOverlay } from '~/systems/Overlay';

import type { AccountsMachineState } from '../machines';

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
  accounts(state: AccountsMachineState) {
    return state.context?.accounts;
  },
  status(state: AccountsMachineState) {
    if (state.hasTag('loading')) return AccountStatus.loading;
    return AccountStatus.idle;
  },
  context(state: AccountsMachineState) {
    return state.context;
  },
  account(state: AccountsMachineState) {
    return state.context.account;
  },
  shownAccounts(state: AccountsMachineState) {
    return state.context.accounts?.filter((acc) => !acc.isHidden);
  },
  hiddenAccounts(state: AccountsMachineState) {
    return state.context.accounts?.filter((acc) => acc.isHidden);
  },
  hasHiddenAccounts(state: AccountsMachineState) {
    return !!selectors.hiddenAccounts(state)?.length;
  },
  canHideAccounts(state: AccountsMachineState) {
    return (selectors.shownAccounts(state)?.length || 0) > 1;
  },
};

const listenerAccountFetcher = () => {
  store.refreshAccounts({ skipLoading: true });
};

export function useAccounts() {
  const shouldListen = useRef(true);
  const hasBalance = store.useSelector(Services.accounts, selectors.hasBalance);
  const accountStatus = store.useSelector(Services.accounts, selectors.status);
  const ctx = store.useSelector(Services.accounts, selectors.context);
  const accounts = store.useSelector(Services.accounts, selectors.accounts);
  const account = store.useSelector(Services.accounts, selectors.account);
  const overlay = useOverlay();
  const shownAccounts = store.useSelector(
    Services.accounts,
    selectors.shownAccounts
  );
  const hiddenAccounts = store.useSelector(
    Services.accounts,
    selectors.shownAccounts
  );
  const hasHiddenAccounts = store.useSelector(
    Services.accounts,
    selectors.hasHiddenAccounts
  );
  const canHideAccounts = store.useSelector(
    Services.accounts,
    selectors.canHideAccounts
  );

  function closeDialog() {
    overlay.close();
  }

  function status(status: keyof typeof AccountStatus) {
    return accountStatus === status;
  }

  useEffect(() => {
    if (shouldListen.current) {
      shouldListen.current = false;
      window.addEventListener('focus', listenerAccountFetcher);
      return () => {
        window.removeEventListener('focus', listenerAccountFetcher);
      };
    }
    return () => {};
  }, []);

  return {
    ...ctx,
    accounts,
    account,
    status,
    hasBalance,
    shownAccounts,
    hiddenAccounts,
    canHideAccounts,
    hasHiddenAccounts,
    isLoading: status('loading'),
    handlers: {
      closeDialog,
      goToList: store.openAccountList,
      goToEdit: store.openAccountEdit,
      goToExport: store.openAccountExport,
      goToImport: store.openAccountImport,
      logout: store.logout,
      setCurrentAccount: store.setCurrentAccount,
      toggleHideAccount: store.toggleHideAccount,
    },
  };
}
