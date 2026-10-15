import { bn } from 'fuels';
import { useEffect, useMemo } from 'react';
import { Services, store } from '~/store';
import { useOverlay } from '~/systems/Overlay';

import type { AccountsMachineState } from '../machines';

enum AccountStatus {
  idle = 'idle',
  loading = 'loading',
  unlocking = 'unlocking',
  unlockingLoading = 'unlockingLoading',
}

const isSame = <T,>(a: T, b: T) => a === b;

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
  account(state: AccountsMachineState) {
    return state.context?.account;
  },
  needsRecovery(state: AccountsMachineState) {
    return state.context?.needsRecovery;
  },
  error(state: AccountsMachineState) {
    return state.context?.error;
  },
  isLoggingOut(state: AccountsMachineState) {
    return state.context?.isLoggingOut;
  },
  skipLoading(state: AccountsMachineState) {
    return state.context?.skipLoading;
  },
};

const FOCUS_REFRESH_DEBOUNCE = 1500;
let focusListeners = 0;
let lastFocusRefresh = 0;

const listenerAccountFetcher = () => {
  const now = Date.now();
  if (now - lastFocusRefresh < FOCUS_REFRESH_DEBOUNCE) return;
  lastFocusRefresh = now;
  store.refreshAccounts({ skipLoading: true });
  store.refreshConsolidateCoins();
};

export function useAccounts() {
  const service = store.useService(Services.accounts);
  const hasBalance = store.useSelector(Services.accounts, selectors.hasBalance);
  const accountStatus = store.useSelector(Services.accounts, selectors.status);
  const accounts = store.useSelector(
    Services.accounts,
    selectors.accounts,
    isSame
  );
  const account = store.useSelector(
    Services.accounts,
    selectors.account,
    isSame
  );
  const needsRecovery = store.useSelector(
    Services.accounts,
    selectors.needsRecovery
  );
  const error = store.useSelector(Services.accounts, selectors.error, isSame);
  const isLoggingOut = store.useSelector(
    Services.accounts,
    selectors.isLoggingOut
  );
  const skipLoading = store.useSelector(
    Services.accounts,
    selectors.skipLoading
  );
  const overlay = useOverlay();

  const { shownAccounts, hiddenAccounts } = useMemo(
    () => ({
      shownAccounts: accounts?.filter((acc) => !acc.isHidden),
      hiddenAccounts: accounts?.filter((acc) => acc.isHidden),
    }),
    [accounts]
  );
  const hasHiddenAccounts = !!hiddenAccounts?.length;
  const canHideAccounts = (shownAccounts?.length || 0) > 1;

  function closeDialog() {
    overlay.close();
  }

  function status(status: keyof typeof AccountStatus) {
    return accountStatus === status;
  }

  function findAccount(address?: string) {
    if (!address) return undefined;
    return accounts?.find(
      (acc) => acc.address.toLowerCase() === address.toLowerCase()
    );
  }

  useEffect(() => {
    if (focusListeners === 0) {
      window.addEventListener('focus', listenerAccountFetcher);
    }
    focusListeners += 1;
    return () => {
      focusListeners -= 1;
      if (focusListeners === 0) {
        window.removeEventListener('focus', listenerAccountFetcher);
      }
    };
  }, []);

  return {
    needsRecovery,
    error,
    isLoggingOut,
    skipLoading,
    // Read on access so fetch start/end does not re-render every consumer
    get isFetchingAccounts() {
      return service.getSnapshot()?.context?.isFetchingAccounts;
    },
    accounts,
    account,
    status,
    hasBalance,
    shownAccounts,
    hiddenAccounts,
    canHideAccounts,
    hasHiddenAccounts,
    isLoading: status('loading'),
    findAccount,
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
