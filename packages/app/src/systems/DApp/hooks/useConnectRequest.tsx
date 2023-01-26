import { useInterpret, useSelector } from '@xstate/react';
import { useEffect, useMemo } from 'react';

import type { ConnectMachineState } from '../machines';
import { connectMachine } from '../machines';
import { useConnectRequestMethods } from '../methods';

import { useAccounts } from '~/systems/Account';

const selectors = {
  isSelectingAccounts: (state: ConnectMachineState) => {
    return state.matches('connecting.selectingAccounts');
  },
  isConnecting: (state: ConnectMachineState) => {
    return state.matches('connecting.authorizing');
  },
  origin: (state: ConnectMachineState) => {
    return state.context.origin;
  },
  selectedAddresses: (state: ConnectMachineState) => {
    return state.context.selectedAddresses;
  },
};

export function useConnectRequest() {
  const { account, accounts, isLoading } = useAccounts();
  const connectionService = useInterpret(
    connectMachine.withConfig({
      actions: {
        closeWindow: () => {
          window.close();
        },
      },
    })
  );
  const isConnecting = useSelector(connectionService, selectors.isConnecting);
  const isSelectingAccounts = useSelector(
    connectionService,
    selectors.isSelectingAccounts
  );
  const origin = useSelector(connectionService, selectors.origin);
  const selectedAddresses = useSelector(
    connectionService,
    selectors.selectedAddresses
  );
  const selectedAccounts = useMemo(() => {
    return (accounts ?? []).filter((account) =>
      selectedAddresses?.includes(account.address)
    );
  }, [selectedAddresses, accounts]);
  const hasSelectedAccounts = !!selectedAddresses?.length;

  // Start Connect Request Methods
  useConnectRequestMethods(connectionService);

  useEffect(() => {
    if (account && !hasSelectedAccounts) {
      connectionService.send({
        type: 'TOGGLE_ADDRESS',
        input: account.address,
      });
    }
  }, [account, hasSelectedAccounts]);

  function authorizeConnection() {
    connectionService.send({
      type: 'AUTHORIZE',
    });
  }

  function rejectConnection() {
    connectionService.send('REJECT');
  }

  function next() {
    connectionService.send('NEXT');
  }

  function back() {
    connectionService.send('BACK');
  }

  function isAccountSelected(address: string) {
    return !!selectedAddresses?.includes(address);
  }

  function toggleAccount(address: string) {
    connectionService.send({
      type: 'TOGGLE_ADDRESS',
      input: address,
    });
  }

  return {
    service: connectionService,
    origin,
    isSelectingAccounts,
    isConnecting,
    isLoadingAccounts: isLoading,
    account,
    accounts,
    selectedAddresses,
    hasSelectedAccounts,
    selectedAccounts,
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
