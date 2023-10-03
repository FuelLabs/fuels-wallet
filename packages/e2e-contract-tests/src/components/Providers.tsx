import type { ReactNode } from 'react';
import { FuelProvider, FuelConnectorProvider } from '@fuel-wallet/react';
import {
  FUEL_WALLET_CONNECTOR,
  FUEL_WALLET_DEVELOPMENT_CONNECTOR,
} from '@fuel-wallet/react';
import { ThemeProvider } from '@fuel-ui/react';

import { IS_TEST } from '../config';

type ProviderProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProviderProps) => {
  return (
    <FuelProvider>
      <FuelConnectorProvider
        theme="dark"
        connectors={[
          IS_TEST ? FUEL_WALLET_CONNECTOR : FUEL_WALLET_DEVELOPMENT_CONNECTOR,
        ]}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </FuelConnectorProvider>
    </FuelProvider>
  );
};
