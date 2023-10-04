import { ThemeProvider } from '@fuel-ui/react';
import {
  FuelProvider,
  FuelConnectorProvider,
  FUEL_WALLET_CONNECTOR,
  FUEL_WALLET_DEVELOPMENT_CONNECTOR,
} from '@fuel-wallet/react';
import type { ReactNode } from 'react';

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
