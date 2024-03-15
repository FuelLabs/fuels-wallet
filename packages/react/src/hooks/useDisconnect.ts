import { useMutation } from '@tanstack/react-query';

import { useFuel } from '../providers';

export const useDisconnect = () => {
  const { fuel } = useFuel();

  const { mutate, mutateAsync, ...mutateProps } = useMutation({
    mutationFn: async () => {
      return fuel?.disconnect();
    },
  });

  return {
    disconnect: mutate,
    disconnectAsync: mutateAsync,
    ...mutateProps,
  };
};
