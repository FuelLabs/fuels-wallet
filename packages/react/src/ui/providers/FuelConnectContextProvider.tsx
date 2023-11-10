import type { FuelConnector } from '@fuel-wallet/sdk';
import {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useCallback,
  useEffect,
} from 'react';

import { useFuel } from '../../components/FuelProvider';
import { useConnect } from '../../hooks/useConnect';
import { useConnectors } from '../../hooks/useConnectors';

export type FuelConnectProviderProps = {
  children?: ReactNode;
  theme?: string;
};

export type FuelConnectContextType = {
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

export const FuelConnectContext = createContext<FuelConnectContextType | null>(
  null
);

export const useFuelConnect = () => {
  return useContext(FuelConnectContext) as FuelConnectContextType;
};

export function FuelConnectContextProvider({
  children,
  theme: initialTheme,
}: FuelConnectProviderProps) {
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
