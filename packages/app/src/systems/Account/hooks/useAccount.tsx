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
};

const listenerAccountFetcher = () => {
  store.send(Services.accounts, {
    type: 'UPDATE_ACCOUNT',
  });
};

export function useAccounts() {
  const shouldListen = useRef(true);
  const navigate = useNavigate();
  const isLoading = store.useSelector(Services.accounts, selectors.isLoading);
  const accounts = store.useSelector(Services.accounts, selectors.accounts);
  const account = store.useSelector(Services.accounts, selectors.account);
  const isAddingAccount = store.useSelector(
    Services.accounts,
    selectors.isAddingAccount
  );

  function goToList() {
    navigate(Pages.accounts());
  }

  function goToAdd() {
    navigate(Pages.accountAdd());
  }

  function addAccount(input: string) {
    store.unlock({
      onSuccess() {
        store.addAccount(input);
      },
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
      addAccount,
      hideAccount: store.hideAccount,
      selectAccount: store.selectAccount,
    },
    isLoading: isLoading && !accounts,
    accounts,
    account,
    isAddingAccount,
  };
}
