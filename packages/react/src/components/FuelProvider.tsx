import { FuelWalletConnector } from '@fuel-wallet/connectors';
import type { FuelConnector } from '@fuel-wallet/sdk-v2';
import { Fuel } from '@fuel-wallet/sdk-v2';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect } from 'react';

import { QUERY_KEYS, selectCurrentConnector } from '../utils';

const queryClientConfig = {
  defaultOptions: {
    queries: {
      // These two are annoying during development
      retry: false,
      refetchOnWindowFocus: false,
      // This is disabled because it causes a bug with arrays with named keys
      // For example, if a query returns: [BN, BN, a: BN, b: BN]
      // with this option on it will be cached as: [BN, BN]
      // and break our code
      structuralSharing: false,
    },
  },
};

type FuelProviderProps = {
  children?: ReactNode;
};

export type FuelReactContextType = {
  fuel: Fuel | undefined;
};

export const FuelReactContext = createContext<FuelReactContextType | null>(
  null
);

export const useFuel = () => {
  return useContext(FuelReactContext) as FuelReactContextType;
};

export const FuelProvider = ({ children }: FuelProviderProps) => {
  const fuel = new Fuel({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    connectors: [new FuelWalletConnector() as any],
  });
  const fuelQueryClient = new QueryClient(queryClientConfig);

  function onConnectorsChange(connectors: Array<FuelConnector>) {
    fuelQueryClient.invalidateQueries([QUERY_KEYS.connectorList]);
    selectCurrentConnector(fuel, connectors)?.then(() => {
      fuelQueryClient.invalidateQueries();
    });
  }

  function onCurrentAccountChange() {
    fuelQueryClient.invalidateQueries([QUERY_KEYS.account]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.wallet]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.balance]);
  }

  function onConnectionChange() {
    fuelQueryClient.invalidateQueries([QUERY_KEYS.account]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.isConnected]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.wallet]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.balance]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.provider]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.nodeInfo]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.accounts]);
  }

  function onNetworkChange() {
    fuelQueryClient.invalidateQueries([QUERY_KEYS.provider]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.transactionReceipts]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.chain]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.nodeInfo]);
  }

  function onAccountsChange() {
    fuelQueryClient.invalidateQueries([QUERY_KEYS.account]);
    fuelQueryClient.invalidateQueries([QUERY_KEYS.accounts]);
  }

  useEffect(() => {
    fuel.on(fuel.events.currentAccount, onCurrentAccountChange);
    fuel.on(fuel.events.connectors, onConnectorsChange);
    fuel.on(fuel.events.connection, onConnectionChange);
    fuel.on(fuel.events.accounts, onAccountsChange);
    fuel.on(fuel.events.currentNetwork, onNetworkChange);

    return () => {
      fuel.off(fuel.events.currentAccount, onCurrentAccountChange);
      fuel.off(fuel.events.connectors, onConnectorsChange);
      fuel.off(fuel.events.connection, onConnectionChange);
      fuel.off(fuel.events.accounts, onAccountsChange);
      fuel.off(fuel.events.currentNetwork, onNetworkChange);
    };
  }, []);

  return (
    <FuelReactContext.Provider value={{ fuel }}>
      <QueryClientProvider client={fuelQueryClient}>
        {children}
      </QueryClientProvider>
    </FuelReactContext.Provider>
  );
};
