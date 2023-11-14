import { useMutation } from '@tanstack/react-query';

import { useFuel } from '../components';

export const useConnect = () => {
  const { fuel } = useFuel();

  const { mutateAsync, ...mutateProps } = useMutation({
    mutationFn: async (connectorName?: string) => {
      if (connectorName) {
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
