/* eslint-disable consistent-return */
import { bn } from 'fuels';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import type { AccountMachineState } from '../machines';

import { Services, store } from '~/store';
import { Pages } from '~/systems/Core';

const selectors = {
  isLoading(state: AccountMachineState) {
    return state.hasTag('loading');
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
  const hasBalance = store.useSelector(Services.accounts, selectors.hasBalance);

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
      hideAccount: store.hideAccount,
      selectAccount: store.selectAccount,
    },
    isLoading: isLoading && !accounts,
    accounts,
    account,
    hasBalance,
  };
}
