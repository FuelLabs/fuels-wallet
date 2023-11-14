import { FuelProvider, FuelConnectorProvider } from '@fuel-wallet/react';
import type { ReactNode } from 'react';

type ProviderProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProviderProps) => {
  return (
    <FuelProvider>
      <FuelConnectorProvider theme="dark">{children}</FuelConnectorProvider>
    </FuelProvider>
  );
};
