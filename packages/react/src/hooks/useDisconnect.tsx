import { useMutation } from '@tanstack/react-query';

import { useFuel } from '../components';

export const useDisconnect = () => {
  const { fuel } = useFuel();

  const { mutate, ...mutateProps } = useMutation({
    mutationFn: async () => {
      return fuel?.disconnect();
    },
  });

  return {
    disconnect: mutate,
    ...mutateProps,
  };
};
