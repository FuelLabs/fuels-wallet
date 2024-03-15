import { FuelProvider } from '@fuels/react';
import type { ReactNode } from 'react';

type ProviderProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProviderProps) => {
  return (
    <FuelProvider
      fuelConfig={{
        devMode: true,
      }}
    >
      {children}
    </FuelProvider>
  );
};
