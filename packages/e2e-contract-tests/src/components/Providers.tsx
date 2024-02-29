import {
  FuelWalletConnector,
  FuelWalletDevelopmentConnector,
} from '@fuel-wallet/sdk';
import { FuelProvider } from '@fuels/react';
import type { ReactNode } from 'react';

type ProviderProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProviderProps) => {
  return (
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
  );
};
