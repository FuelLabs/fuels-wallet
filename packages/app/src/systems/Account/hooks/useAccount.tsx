/* eslint-disable consistent-return */
import { useEffect, useRef } from 'react';

import type { AccountMachineState } from '../machines';

import { Services, store } from '~/store';

const selectors = {
  isLoading: (state: AccountMachineState) => {
    return state.hasTag('loading');
  },
  account: (state: AccountMachineState) => {
    return state.context?.data;
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
    isLoading: isLoading && !account,
    account,
  };
}
