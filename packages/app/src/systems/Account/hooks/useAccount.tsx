/* eslint-disable consistent-return */
import { bn } from 'fuels';
import { useEffect, useRef } from 'react';

import type { AccountMachineState } from '../machines';

import { Services, store } from '~/store';

const selectors = {
  isLoading(state: AccountMachineState) {
    return state.hasTag('loading');
  },
  account(state: AccountMachineState) {
    return state.context?.data;
  },
  hasBalance(state: AccountMachineState) {
    const acc = state.context?.data;
    return bn(acc?.balance ?? 0).gt(0);
  },
};

const listenerAccountFetcher = () => {
  store.send(Services.account, {
    type: 'UPDATE_ACCOUNT',
  });
};

export function useAccount() {
  const shouldListen = useRef(true);
  const isLoading = store.useSelector(Services.account, selectors.isLoading);
  const account = store.useSelector(Services.account, selectors.account);
  const hasBalance = store.useSelector(Services.account, selectors.hasBalance);

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
      setBalanceVisibility: store.setBalanceVisibility,
    },
    isLoading: isLoading && !account,
    account,
    hasBalance,
  };
}
