import type { Connection } from '@fuel-wallet/types';
import { useCallback, useEffect, useState } from 'react';
import { ConnectionService } from '../services';

interface UseConnectionProps {
  origin: string | undefined;
}

export const useConnection = ({ origin }: UseConnectionProps) => {
  const [connection, setConnection] = useState<Connection | undefined>();

  const fetchConnection = useCallback(async () => {
    if (!origin) return;
    const existingConnection = await ConnectionService.getConnection(origin);
    setConnection(existingConnection);
  }, [origin]);

  useEffect(() => {
    fetchConnection();
  }, [fetchConnection]);

  return {
    connection,
    fetchConnection,
  };
};
