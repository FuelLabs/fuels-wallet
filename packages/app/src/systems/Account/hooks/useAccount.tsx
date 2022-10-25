import { useEffect } from 'react';

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

export function useAccount() {
  const isLoading = store.useSelector(Services.account, selectors.isLoading);
  const account = store.useSelector(Services.account, selectors.account);

  useEffect(() => {
    const listenerAccountFetcher = () => {
      store.send(Services.account, {
        type: 'UPDATE_ACCOUNT',
      });
    };

    window.addEventListener('focus', listenerAccountFetcher);

    return () => {
      window.removeEventListener('focus', listenerAccountFetcher);
    };
  }, []);

  return {
    isLoading: isLoading && !account,
    account,
  };
}
