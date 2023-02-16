import { useSelector } from '@xstate/react';
import { useEffect, useMemo } from 'react';

import type { ConnectRequestState } from '../machines';

import { Services, store } from '~/store';
import { useAccounts } from '~/systems/Account';

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
  originTitle: (state: ConnectRequestState) => {
    return state.context.originTitle;
  },
  faviconUrl: (state: ConnectRequestState) => {
    return state.context.faviconUrl;
  },
  selectedAddresses: (state: ConnectRequestState) => {
    return state.context.selectedAddresses;
  },
};

export function useConnectRequest() {
  const { account, accounts, isLoading } = useAccounts();
  const service = store.useService(Services.connectRequest);
  const isConnecting = useSelector(service, selectors.isConnecting);
  const isSelectingAccounts = useSelector(
    service,
    selectors.isSelectingAccounts
  );
  const origin = useSelector(service, selectors.origin);
  const originTitle = useSelector(service, selectors.originTitle);
  const faviconUrl = useSelector(service, selectors.faviconUrl);
  const selectedAddresses = useSelector(service, selectors.selectedAddresses);
  const currentAccounts = useMemo(() => {
    return (accounts ?? []).filter((account) =>
      selectedAddresses?.includes(account.address)
    );
  }, [selectedAddresses, accounts]);
  const hasCurrentAccounts = !!selectedAddresses?.length;

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
    originTitle,
    faviconUrl,
    isSelectingAccounts,
    isConnecting,
    isLoadingAccounts: isLoading,
    account,
    accounts,
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
