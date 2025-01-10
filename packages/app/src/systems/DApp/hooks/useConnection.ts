import type { Connection } from '@fuel-wallet/types';
import { useEffect, useState } from 'react';
import { ConnectionService } from '../services';

interface UseConnectionProps {
  url: string | undefined;
}

const parseUrl = (url: string): string | undefined => {
  try {
    const { protocol, hostname, port } = new URL(url);
    return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
  } catch (_e) {
    return undefined;
  }
};

export const useConnection = ({ url }: UseConnectionProps) => {
  const [connection, setConnection] = useState<Connection | undefined>();

  useEffect(() => {
    const fetchConnection = async () => {
      if (!url) return;
      const origin = parseUrl(url);
      const existingConnection = await ConnectionService.getConnection(origin);
      setConnection(existingConnection);
    };

    fetchConnection();
  }, [url]);

  return {
    connection,
  };
};
