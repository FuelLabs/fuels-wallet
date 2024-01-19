import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { QUERY_KEYS } from '../utils';

import { useFuel } from './FuelHooksProvider';

export function FuelEventsWatcher() {
  const { fuel } = useFuel();
  const fuelQueryClient = useQueryClient();

  function onCurrentConnectorChange() {
    fuelQueryClient.invalidateQueries([QUERY_KEYS.account]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.isConnected]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.wallet]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.balance]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.provider]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.nodeInfo]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.accounts]);
  }

  function onConnectorsChange() {
    fuelQueryClient.invalidateQueries([QUERY_KEYS.connectorList]);
  }

  function onCurrentAccountChange() {
    fuelQueryClient.invalidateQueries([QUERY_KEYS.account]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.wallet]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.balance]);
  }

  function onConnectionChange() {
    fuelQueryClient.invalidateQueries([QUERY_KEYS.isConnected]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.account]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.wallet]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.balance]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.provider]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.nodeInfo]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.accounts]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.connectorList]);
  }

  function onNetworkChange() {
    fuelQueryClient.invalidateQueries([QUERY_KEYS.currentNetwork]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.provider]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.transactionReceipts]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.chain]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.nodeInfo]);
  }

  function onAccountsChange() {
    fuelQueryClient.invalidateQueries([QUERY_KEYS.account]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.accounts]);
  }

  function onAssetsChange() {
    fuelQueryClient.invalidateQueries([QUERY_KEYS.assets]);
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
  }, [fuel, fuelQueryClient]);

  return null;
}
