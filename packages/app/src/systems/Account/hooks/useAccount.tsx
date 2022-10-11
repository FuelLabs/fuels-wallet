import usePolling from 'react-use-poll';

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

  usePolling(
    () => {
      if (isLoading || !account) {
        return;
      }
      store.send(Services.account, {
        type: 'REFRESH_ACCOUNT',
      }); // Sends the event to refresh the store
    },
    [isLoading, account],
    {
      interval: 15000,
    }
  ); // this will refresh the account at every 15 seconds

  return {
    isLoading,
    account,
  };
}
