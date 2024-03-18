import {
  FuelWalletConnector,
  FuelWalletDevelopmentConnector,
} from '@fuels/connectors';
import { FuelProvider } from '@fuels/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

type ProviderProps = {
  children: ReactNode;
};

const queryClient = new QueryClient();

export const Providers = ({ children }: ProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <FuelProvider
        fuelConfig={{
          connectors: [
            new FuelWalletConnector(),
            new FuelWalletDevelopmentConnector(),
          ],
        }}
      >
        {children}
      </FuelProvider>
    </QueryClientProvider>
  );
};
