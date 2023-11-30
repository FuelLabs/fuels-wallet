import type { FuelConnector } from '@fuel-wallet/sdk';
import {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useCallback,
  useEffect,
} from 'react';

import { useConnect } from '../hooks/useConnect';
import { useConnectors } from '../hooks/useConnectors';

import { useFuel } from './FuelHooksProvider';

export type FuelUIProviderProps = {
  children?: ReactNode;
  theme?: string;
};

export type FuelUIContextType = {
  theme: string;
  connectors: Array<FuelConnector>;
  isLoading: boolean;
  isConnecting: boolean;
  isError: boolean;
  connect: () => void;
  cancel: () => void;
  setTheme: (theme: string) => void;
  error: Error | null;
  dialog: {
    connector: FuelConnector | null;
    isOpen: boolean;
    back: () => void;
    connect: (connector: FuelConnector) => void;
  };
};

export const FuelConnectContext = createContext<FuelUIContextType | null>(null);

export const useHasFuelConnectProvider = () => {
  const context = useContext(FuelConnectContext);
  return context !== undefined;
};

export const useConnectUI = () => {
  const context = useContext(FuelConnectContext) as FuelUIContextType;

  if (context === undefined) {
    throw new Error('useConnectUI must be used within a FuelUIProvider');
  }

  return context;
};

export function FuelUIProvider({
  children,
  theme: initialTheme,
}: FuelUIProviderProps) {
  const [theme, setTheme] = useState(initialTheme || 'light');
  const { fuel } = useFuel();
  const { isLoading: isConnecting, isError, connect } = useConnect();
  const { connectors, isLoading } = useConnectors();
  const [connector, setConnector] = useState<FuelConnector | null>(null);
  const [isOpen, setOpen] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleCancel = () => {
    setOpen(false);
    setConnector(null);
  };

  const handleConnect = () => {
    setOpen(true);
  };

  const handleBack = () => {
    setConnector(null);
  };

  useEffect(() => {
    if (connector && connector.installed) {
      handleBack();
    }
  }, [connectors.map((c) => c.installed)]);

  const handleSelectConnector = useCallback(
    async (connector: FuelConnector) => {
      if (!fuel) return setConnector(connector);

      if (connector.installed) {
        handleCancel();
        try {
          await connect(connector.name);
        } catch (err) {
          setError(err as Error);
        }
      } else {
        setConnector(connector);
      }
    },
    [fuel]
  );

  return (
    <FuelConnectContext.Provider
      value={{
        theme,
        setTheme,
        isLoading,
        isConnecting,
        isError,
        connectors,
        error,
        connect: handleConnect,
        cancel: handleCancel,
        dialog: {
          connector,
          isOpen,
          connect: handleSelectConnector,
          back: handleBack,
        },
      }}
    >
      {children}
    </FuelConnectContext.Provider>
  );
}
