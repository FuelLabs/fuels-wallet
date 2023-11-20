import { FuelProvider, FuelConnectProvider } from '@fuel-wallet/react';
import type { ReactNode } from 'react';

type ProviderProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProviderProps) => {
  return (
    <FuelProvider>
      <FuelConnectProvider>{children}</FuelConnectProvider>
    </FuelProvider>
  );
};
