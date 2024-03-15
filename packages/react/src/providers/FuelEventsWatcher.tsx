import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { QUERY_KEYS } from '../utils';

import { useFuel } from './FuelHooksProvider';

export function FuelEventsWatcher() {
  const { fuel } = useFuel();
  const queryClient = useQueryClient();

  function onCurrentConnectorChange() {
    queryClient.invalidateQueries([QUERY_KEYS.account]);
    queryClient.invalidateQueries([QUERY_KEYS.isConnected]);
    queryClient.invalidateQueries([QUERY_KEYS.wallet]);
    queryClient.invalidateQueries([QUERY_KEYS.balance]);
    queryClient.invalidateQueries([QUERY_KEYS.provider]);
    queryClient.invalidateQueries([QUERY_KEYS.nodeInfo]);
    queryClient.invalidateQueries([QUERY_KEYS.accounts]);
  }

  function onConnectorsChange() {
    queryClient.invalidateQueries([QUERY_KEYS.connectorList]);
  }

  function onCurrentAccountChange() {
    queryClient.invalidateQueries([QUERY_KEYS.account]);
    queryClient.invalidateQueries([QUERY_KEYS.wallet]);
    queryClient.invalidateQueries([QUERY_KEYS.balance]);
  }

  function onConnectionChange() {
    queryClient.invalidateQueries([QUERY_KEYS.isConnected]);
    queryClient.invalidateQueries([QUERY_KEYS.account]);
    queryClient.invalidateQueries([QUERY_KEYS.wallet]);
    queryClient.invalidateQueries([QUERY_KEYS.balance]);
    queryClient.invalidateQueries([QUERY_KEYS.provider]);
    queryClient.invalidateQueries([QUERY_KEYS.nodeInfo]);
    queryClient.invalidateQueries([QUERY_KEYS.accounts]);
    queryClient.invalidateQueries([QUERY_KEYS.connectorList]);
  }

  function onNetworkChange() {
    queryClient.invalidateQueries([QUERY_KEYS.currentNetwork]);
    queryClient.invalidateQueries([QUERY_KEYS.provider]);
    queryClient.invalidateQueries([QUERY_KEYS.transactionReceipts]);
    queryClient.invalidateQueries([QUERY_KEYS.chain]);
    queryClient.invalidateQueries([QUERY_KEYS.nodeInfo]);
  }

  function onAccountsChange() {
    queryClient.invalidateQueries([QUERY_KEYS.account]);
    queryClient.invalidateQueries([QUERY_KEYS.accounts]);
  }

  function onAssetsChange() {
    queryClient.invalidateQueries([QUERY_KEYS.assets]);
  }

  useEffect(() => {
    fuel.on(fuel.events.currentAccount, onCurrentAccountChange);
    fuel.on(fuel.events.currentConnector, onCurrentConnectorChange);
    fuel.on(fuel.events.connectors, onConnectorsChange);
    fuel.on(fuel.events.connection, onConnectionChange);
    fuel.on(fuel.events.accounts, onAccountsChange);
    fuel.on(fuel.events.currentNetwork, onNetworkChange);
    fuel.on(fuel.events.assets, onAssetsChange);

    return () => {
      fuel.off(fuel.events.currentConnector, onCurrentConnectorChange);
      fuel.off(fuel.events.currentAccount, onCurrentAccountChange);
      fuel.off(fuel.events.connectors, onConnectorsChange);
      fuel.off(fuel.events.connection, onConnectionChange);
      fuel.off(fuel.events.accounts, onAccountsChange);
      fuel.off(fuel.events.currentNetwork, onNetworkChange);
      fuel.off(fuel.events.assets, onAssetsChange);
    };
  }, [fuel, queryClient]);

  return null;
}
