import type { FuelConnector } from '@fuel-wallet/sdk';
import {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useCallback,
} from 'react';

import { useConnect } from '../hooks/useConnect';
import { useConnectors } from '../hooks/useConnectors';
import { Connect } from '../ui';

import { useFuel } from './FuelProvider';

type FuelConnectProviderProps = {
  children?: ReactNode;
  theme: string;
};

export type FuelConnectContextType = {
  connectors: Array<FuelConnector>;
  isConnecting: boolean;
  isError: boolean;
  connect: () => void;
  cancel: () => void;
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

export const useConnector = () => {
  return useContext(FuelConnectContext) as FuelConnectContextType;
};

export function FuelConnectorProvider({
  theme,
  children,
}: FuelConnectProviderProps) {
  const { fuel } = useFuel();
  const { isLoading: isConnecting, isError, connect } = useConnect();
  const { connectors } = useConnectors();
  const [connector, setConnector] = useState<FuelConnector | null>(null);
  const [isOpen, setOpen] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleCancel = () => {
    setOpen(false);
  };

  const handleConnect = () => {
    setOpen(true);
  };

  const handleBack = () => {
    setConnector(null);
  };

  const handleSelectConnector = useCallback(
    async (connector: FuelConnector) => {
      if (!fuel) return setConnector(connector);

      const connectors = await fuel.connectors();
      const hasConnector = connectors.find((c) => c.name === connector.name);

      if (hasConnector) {
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
      <Connect theme={theme} />
      {children}
    </FuelConnectContext.Provider>
  );
}
