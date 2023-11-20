import { Connect } from '../Connect';

import type { FuelConnectProviderProps } from './FuelConnectContextProvider';
import { FuelConnectContextProvider } from './FuelConnectContextProvider';

export {
  FuelConnectContextType,
  FuelConnectContext,
  useFuelConnect,
} from './FuelConnectContextProvider';

export function FuelConnectProvider({
  theme,
  children,
}: FuelConnectProviderProps) {
  return (
    <FuelConnectContextProvider theme={theme}>
      <Connect />
      {children}
    </FuelConnectContextProvider>
  );
}
