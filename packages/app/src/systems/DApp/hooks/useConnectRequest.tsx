import { useSelector } from '@xstate/react';
import { useEffect, useMemo } from 'react';
import { Services, store } from '~/store';
import { useAccounts } from '~/systems/Account';

import type { ConnectRequestState } from '../machines';

const selectors = {
  isSelectingAccounts: (state: ConnectRequestState) => {
    return state.matches('connecting.selectingAccounts');
  },
  isConnecting: (state: ConnectRequestState) => {
    return state.matches('connecting.authorizing');
  },
  origin: (state: ConnectRequestState) => {
    return state.context.origin;
  },
  title: (state: ConnectRequestState) => {
    return state.context.title;
  },
  favIconUrl: (state: ConnectRequestState) => {
    return state.context.favIconUrl;
  },
  selectedAddresses: (state: ConnectRequestState) => {
    return state.context.selectedAddresses;
  },
};

export function useConnectRequest() {
  const { account, shownAccounts, isLoading } = useAccounts();
  const service = store.useService(Services.connectRequest);
  const isConnecting = useSelector(service, selectors.isConnecting);
  const isSelectingAccounts = useSelector(
    service,
    selectors.isSelectingAccounts
  );
  const origin = useSelector(service, selectors.origin);
  const title = useSelector(service, selectors.title);
  const favIconUrl = useSelector(service, selectors.favIconUrl);
  const selectedAddresses = useSelector(service, selectors.selectedAddresses);
  const currentAccounts = useMemo(() => {
    return (shownAccounts ?? []).filter((account) =>
      selectedAddresses?.includes(account.address)
    );
  }, [selectedAddresses, shownAccounts]);
  const hasCurrentAccounts = !!selectedAddresses?.length;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (account && !hasCurrentAccounts) {
      service.send({
        type: 'TOGGLE_ADDRESS',
        input: account.address,
      });
    }
  }, [account, hasCurrentAccounts]);

  function toggleAccount(address: string) {
    service.send({
      type: 'TOGGLE_ADDRESS',
      input: address,
    });
  }

  function authorizeConnection() {
    service.send('AUTHORIZE');
  }

  function rejectConnection() {
    service.send('REJECT');
  }

  function next() {
    service.send('NEXT');
  }

  function back() {
    service.send('BACK');
  }

  function isAccountSelected(address: string) {
    return !!selectedAddresses?.includes(address);
  }

  return {
    origin,
    title,
    favIconUrl,
    isSelectingAccounts,
    isConnecting,
    isLoadingAccounts: isLoading,
    account,
    accounts: shownAccounts,
    selectedAddresses,
    hasCurrentAccounts,
    currentAccounts,
    handlers: {
      rejectConnection,
      authorizeConnection,
      isAccountSelected,
      toggleAccount,
      next,
      back,
    },
  };
}
