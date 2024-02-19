import { FuelWalletConnector, FueletWalletConnector } from '@fuel-wallet/sdk';
import type { FuelConfig } from 'fuels';

import { Connect } from '../ui/Connect';

import { FuelHooksProvider } from './FuelHooksProvider';
import { FuelUIProvider, type FuelUIProviderProps } from './FuelUIProvider';

export { useFuel } from './FuelHooksProvider';
export { useConnectUI } from './FuelUIProvider';

type FuelProviderProps = {
  ui?: boolean;
  fuelConfig?: FuelConfig;
} & FuelUIProviderProps;

export function FuelProvider({
  theme,
  children,
  fuelConfig = {
    connectors: [new FuelWalletConnector(), new FueletWalletConnector()],
  },
  ui = true,
}: FuelProviderProps) {
  if (ui) {
    return (
      <FuelHooksProvider fuelConfig={fuelConfig}>
        <FuelUIProvider theme={theme}>
          <Connect />
          {children}
        </FuelUIProvider>
      </FuelHooksProvider>
    );
  }
  return (
    <FuelHooksProvider fuelConfig={fuelConfig}>{children}</FuelHooksProvider>
  );
}
