import type { FuelConfig } from '@fuel-wallet/sdk';
import { Fuel } from '@fuel-wallet/sdk';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { createContext, useContext, useMemo } from 'react';

import { FuelEventsWatcher } from './FuelEventsWatcher';

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
  fuelConfig?: FuelConfig;
};

export type FuelReactContextType = {
  fuel: Fuel;
};

export const FuelReactContext = createContext<FuelReactContextType | null>(
  null
);

export const useFuel = () => {
  const context = useContext(FuelReactContext) as FuelReactContextType;
  if (!context) {
    throw new Error('useFuel must be used within a FuelHooksProvider');
  }
  return context;
};
export const fuelQueryClient = new QueryClient(queryClientConfig);

export const FuelHooksProvider = ({
  children,
  fuelConfig,
}: FuelProviderProps) => {
  const fuel = useMemo(() => {
    return new Fuel(fuelConfig);
  }, [fuelConfig]);

  return (
    <FuelReactContext.Provider value={{ fuel }}>
      <QueryClientProvider client={fuelQueryClient}>
        <FuelEventsWatcher />
        {children}
      </QueryClientProvider>
    </FuelReactContext.Provider>
  );
};
