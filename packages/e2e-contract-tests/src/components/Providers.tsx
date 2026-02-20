import {
  FuelWalletConnector,
  FuelWalletDevelopmentConnector,
} from '@fuels/connectors';
import { FuelProvider, type UIConfig } from '@fuels/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CHAIN_IDS } from 'fuels';
import type { FuelConfig, Network } from 'fuels';
import type { ReactNode } from 'react';

type ProviderProps = {
  children: ReactNode;
};

const queryClient = new QueryClient();

const FUEL_PROVIDER_URL: string = import.meta.env.VITE_FUEL_PROVIDER_URL;
const CHAIN_ID = FUEL_PROVIDER_URL?.includes('devnet')
  ? CHAIN_IDS.fuel.devnet
  : CHAIN_IDS.fuel.testnet;

const NETWORKS: Array<Network> = [
  {
    chainId: CHAIN_ID,
    url: FUEL_PROVIDER_URL,
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
    </QueryClientProvider>
  );
};
