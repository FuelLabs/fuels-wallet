/* eslint-disable consistent-return */
import { bn } from 'fuels';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import type { AccountMachineState } from '../machines';

import { store, Services } from '~/store';
import { Pages } from '~/systems/Core';

const selectors = {
  isLoading(state: AccountMachineState) {
    return state.hasTag('loading');
  },
  isAddingAccount: (state: AccountMachineState) => {
    return state.matches('addingAccount');
  },
  accounts: (state: AccountMachineState) => {
    return state.context?.accounts;
  },
  account: (state: AccountMachineState) => {
    return state.context?.account;
  },
  hasBalance(state: AccountMachineState) {
    const acc = state.context?.account;
    return bn(acc?.balance ?? 0).gt(0);
  },
  unlockError: (state: AccountMachineState) => {
    return state.context?.unlockError;
  },
  isUnlocking: (state: AccountMachineState) => {
    return state.matches('unlocking');
  },
  isUnlockingLoading: (state: AccountMachineState) => {
    return state.children.unlock?.state.matches('unlockingVault');
  },
};

const listenerAccountFetcher = () => {
  store.send(Services.accounts, {
    type: 'UPDATE_ACCOUNT',
  });
};

export function useAccounts() {
  const shouldListen = useRef(true);
  const navigate = useNavigate();
  const isAddingAccount = store.useSelector(
    Services.accounts,
    selectors.isAddingAccount
  );
  const isLoading = store.useSelector(Services.accounts, selectors.isLoading);
  const accounts = store.useSelector(Services.accounts, selectors.accounts);
  const account = store.useSelector(Services.accounts, selectors.account);
  const hasBalance = store.useSelector(Services.accounts, selectors.hasBalance);
  const unlockError = store.useSelector(
    Services.accounts,
    selectors.unlockError
  );
  const isUnlocking = store.useSelector(
    Services.accounts,
    selectors.isUnlocking
  );
  const isUnlockingLoading = store.useSelector(
    Services.accounts,
    selectors.isUnlockingLoading
  );

  function goToList() {
    navigate(Pages.accounts());
  }

  function goToAdd() {
    navigate(Pages.accountAdd());
  }

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

  store.useUpdateMachineConfig(Services.accounts, {
    actions: {
      redirectToHome() {
        navigate(Pages.wallet());
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
    accounts,
    account,
    hasBalance,
    unlockError,
    isUnlocking,
    isUnlockingLoading,
    isAddingAccount,
    isLoading: isLoading && !accounts,
    handlers: {
      goToList,
      goToAdd,
      unlock,
      closeUnlock,
      logout: store.logout,
      hideAccount: store.hideAccount,
      setCurrentAccount: store.setCurrentAccount,
      addAccount: store.addAccount,
    },
  };
}
