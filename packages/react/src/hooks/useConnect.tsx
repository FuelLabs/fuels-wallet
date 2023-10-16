import { useMutation } from '@tanstack/react-query';

import { useFuel } from '../components';
import { CONNECTOR_KEY } from '../config';

export const useConnect = () => {
  const { fuel } = useFuel();

  const { mutateAsync, ...mutateProps } = useMutation({
    mutationFn: async (connectorName?: string) => {
      if (connectorName) {
        localStorage.setItem(CONNECTOR_KEY, connectorName);
        await fuel?.selectConnector(connectorName);
      }
      return fuel?.connect();
    },
  });

  return {
    connect: mutateAsync,
    ...mutateProps,
  };
};
