/* eslint-disable consistent-return */
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import type { AccountMachineState } from '../machines';

import { store, Services } from '~/store';
import { Pages } from '~/systems/Core';

const selectors = {
  isLoading: (state: AccountMachineState) => {
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
  isUnlocking: (state: AccountMachineState) => {
    return state.matches('unlocking');
  },
  isUnlockingLoading: (state: AccountMachineState) => {
    return state.children.unlock?.state.matches('unlocking');
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
      type: 'UNLOCK_WALLET',
      input: { password, account: account! },
    });
  }

  function closeUnlock() {
    store.send(Services.accounts, {
      type: 'CLOSE_UNLOCK',
    });
  }

  store.useSetMachineConfig(Services.accounts, {
    actions: {
      redirectToHome() {
        navigate(Pages.wallet());
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
    handlers: {
      goToList,
      goToAdd,
      unlock,
      closeUnlock,
      hideAccount: store.hideAccount,
      selectAccount: store.selectAccount,
      addAccount: store.addAccount,
    },
    isLoading: isLoading && !accounts,
    accounts,
    account,
    isUnlocking,
    isUnlockingLoading,
    isAddingAccount,
  };
}
