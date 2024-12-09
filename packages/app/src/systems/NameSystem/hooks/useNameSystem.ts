import { isValidDomain } from '@bako-id/sdk';
import debounce from 'lodash.debounce';
import { useCallback, useMemo } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { delay } from '~/systems/Core';
import { NameSystemService } from '~/systems/NameSystem/services';
import { useProvider } from '~/systems/Network/hooks/useProvider';

export const useNameSystem = () => {
  const provider = useProvider();
  const queryClient = useQueryClient();

  const resolveNameMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!provider) return null;
      const nameSystem = new NameSystemService(provider, queryClient);
      await delay(1200);
      return nameSystem.resolver(name);
    },
  });

  const resolveAddressMutation = useMutation({
    mutationFn: async (address: string) => {
      if (!provider) return null;
      const nameSystem = new NameSystemService(provider, queryClient);
      await delay(1200);
      return nameSystem.name(address);
    },
  });

  const clear = () => {
    resolveNameMutation.reset();
    resolveAddressMutation.reset();
  };

  const isName = useCallback((name: string) => {
    return name.startsWith('@') && isValidDomain(name);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const getResolver = useCallback(debounce(resolveNameMutation.mutate, 500), [
    resolveNameMutation.mutate,
  ]);

  const profileURI = useMemo(() => {
    if (!provider || !resolveNameMutation.data?.name) return null;
    return NameSystemService.profileURI(
      provider,
      resolveNameMutation.data?.name
    );
  }, [provider, resolveNameMutation.data?.name]);

  return {
    handlers: {
      clear,
      isName,
      getResolver,
      getName: resolveAddressMutation.mutate,
    },
    profileURI,
    isLoading:
      resolveAddressMutation.isPending || resolveNameMutation.isPending,
    name: {
      isLoading: resolveAddressMutation.isPending,
      isSuccess: resolveAddressMutation.isSuccess,
      value:
        resolveAddressMutation.data?.name ?? resolveNameMutation.data?.name,
    },
    resolver: {
      isLoading: resolveNameMutation.isPending,
      isSuccess: resolveNameMutation.isSuccess,
      value:
        resolveAddressMutation.data?.address ??
        resolveNameMutation.data?.address,
    },
  };
};
