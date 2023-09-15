import type { Fuel } from '@fuel-wallet/sdk';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useContext, createContext, useEffect } from 'react';

import { useWindowFuel } from '../hooks';
import { QUERY_KEYS } from '../utils';

export const fuelQueryClient = new QueryClient({
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
});

type FuelProviderProps = {
  children?: ReactNode;
};

type FuelReactContextType = {
  fuel: Fuel | undefined;
};

export const FuelReactContext = createContext<FuelReactContextType | null>(
  null
);

export const useFuel = () => {
  return useContext(FuelReactContext) as FuelReactContextType;
};

export const FuelProvider = ({ children }: FuelProviderProps) => {
  const fuel = useWindowFuel();

  function onCurrentAccountChange() {
    fuelQueryClient.fetchQuery([QUERY_KEYS.account]);
    fuelQueryClient.fetchQuery([QUERY_KEYS.wallet]);
    fuelQueryClient.fetchQuery([QUERY_KEYS.balance]);
  }

  function onConnectionChange() {
    fuelQueryClient.fetchQuery([QUERY_KEYS.account]);
    fuelQueryClient.fetchQuery([QUERY_KEYS.isConnected]);
    fuelQueryClient.fetchQuery([QUERY_KEYS.wallet]);
    fuelQueryClient.fetchQuery([QUERY_KEYS.balance]);
    fuelQueryClient.fetchQuery([QUERY_KEYS.provider]);
    fuelQueryClient.fetchQuery([QUERY_KEYS.nodeInfo]);
  }

  function onNetworkChange() {
    fuelQueryClient.fetchQuery([QUERY_KEYS.provider]);
    fuelQueryClient.fetchQuery([QUERY_KEYS.transactionReceipts]);
    fuelQueryClient.fetchQuery([QUERY_KEYS.chain]);
    fuelQueryClient.fetchQuery([QUERY_KEYS.nodeInfo]);
  }

  function onAccountsChange() {
    fuelQueryClient.fetchQuery([QUERY_KEYS.account]);
  }

  useEffect(() => {
    fuel?.on(fuel.events.currentAccount, onCurrentAccountChange);
    fuel?.on(fuel.events.connection, onConnectionChange);
    fuel?.on(fuel.events.accounts, onAccountsChange);
    fuel?.on(fuel.events.network, onNetworkChange);

    return () => {
      fuel?.off(fuel.events.currentAccount, onCurrentAccountChange);
      fuel?.off(fuel.events.connection, onConnectionChange);
      fuel?.off(fuel.events.accounts, onAccountsChange);
      fuel?.off(fuel.events.network, onNetworkChange);
    };
  }, [fuel]);

  return (
    <FuelReactContext.Provider value={{ fuel }}>
      <QueryClientProvider client={fuelQueryClient}>
        {children}
      </QueryClientProvider>
    </FuelReactContext.Provider>
  );
};
