import {
  createContext,
  useContext,
  type ReactNode,
  useMemo,
  useState,
  useCallback,
} from 'react';

import { useConnect } from '../hooks/useConnect';
import { useConnectors } from '../hooks/useConnectors';
import type { Connector, ConnectorList } from '../types';
import { Connect } from '../ui';
import { DEFAULT_CONNECTORS } from '../ui/Connect/connectors';

import { useFuel } from './FuelProvider';

type FuelConnectProviderProps = {
  children?: ReactNode;
  theme: string;
  connectors?: ConnectorList;
};

export type FuelConnectContextType = {
  connectors: ConnectorList;
  isConnecting: boolean;
  isError: boolean;
  connect: () => void;
  cancel: () => void;
  error: Error | null;
  dialog: {
    connector: Connector | null;
    isOpen: boolean;
    back: () => void;
    connect: (connector: Connector) => void;
  };
};

export const FuelConnectContext = createContext<FuelConnectContextType | null>(
  null,
);

export const useConnector = () => {
  return useContext(FuelConnectContext) as FuelConnectContextType;
};

export function FuelConnectorProvider({
  theme,
  children,
  connectors: initalConnectors = DEFAULT_CONNECTORS,
}: FuelConnectProviderProps) {
  const { fuel } = useFuel();
  const { isLoading: isConnecting, isError, connect } = useConnect();
  const { connectors: connectorList } = useConnectors();
  const connectors = useMemo(() => {
    return initalConnectors
      .map((connector) => ({
        ...connector,
        installed: !!connectorList.find((c) => c.name === connector.name),
      }))
      .sort((a) => (a.installed ? -1 : 1));
  }, [initalConnectors, connectorList]);
  const [connector, setConnector] = useState<Connector | null>(null);
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
    async (connector: Connector) => {
      if (!fuel) return setConnector(connector);

      const connectors = await fuel.listConnectors();
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
    [fuel],
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
