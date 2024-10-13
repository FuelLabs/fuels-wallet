import {
  FuelWalletConnector,
  FuelWalletDevelopmentConnector,
} from '@fuels/connectors';
import { FuelProvider, type UIConfig } from '@fuels/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { FuelConfig, Network } from 'fuels';
import type { ReactNode } from 'react';

type ProviderProps = {
  children: ReactNode;
};

const queryClient = new QueryClient();

const CHAIN_ID_LOCAL = 0;
const NETWORKS: Array<Network> = [
  {
    chainId: CHAIN_ID_LOCAL,
    url: import.meta.env.VITE_FUEL_PROVIDER_URL,
  },
];

const UI_CONFIG: UIConfig = {
  suggestBridge: false,
};

const FUEL_CONFIG: FuelConfig = {
  connectors: [new FuelWalletConnector(), new FuelWalletDevelopmentConnector()],
};

export const Providers = ({ children }: ProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <FuelProvider
        uiConfig={UI_CONFIG}
        fuelConfig={FUEL_CONFIG}
        networks={NETWORKS}
      >
        {children}
      </FuelProvider>
      ∫
    </QueryClientProvider>
  );
};
