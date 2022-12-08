/* eslint-disable consistent-return */
import type { Account } from '@fuel-wallet/types';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import type { AccountMachineState } from '../machines';

import { Services, store } from '~/store';
import { Pages } from '~/systems/Core';

const selectors = {
  isLoading: (state: AccountMachineState) => {
    return state.hasTag('loading');
  },
  accounts: (state: AccountMachineState) => {
    return state.context?.accounts;
  },
  account: (state: AccountMachineState) => {
    return state.context.account;
  },
  selectedAccount: (state: AccountMachineState) => {
    const accounts = state.context.accounts || [];
    return accounts.find((account) => account.isSelected) as Account;
  },
};

const listenerAccountFetcher = () => {
  store.send(Services.accounts, {
    type: 'UPDATE_ACCOUNT',
  });
};

export function useAccount() {
  const shouldListen = useRef(true);
  const navigate = useNavigate();
  const isLoading = store.useSelector(Services.accounts, selectors.isLoading);
  const accounts = store.useSelector(Services.accounts, selectors.accounts);
  const account = store.useSelector(Services.accounts, selectors.account);
  const selectedAccount = store.useSelector(
    Services.accounts,
    selectors.selectedAccount
  );

  function goToList() {
    navigate(Pages.accounts());
  }

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
      setBalanceVisibility: store.setBalanceVisibility,
    },
    isLoading: isLoading && !accounts,
    accounts,
    account,
    selectedAccount,
  };
}
