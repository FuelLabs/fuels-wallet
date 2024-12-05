import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isB256 } from 'fuels';
import { NameSystemService } from '~/systems/NameSystem/services';
import { NS_QUERY_KEYS } from '~/systems/NameSystem/utils/queryKeys';
import { useProvider } from '~/systems/Network/hooks/useProvider';

export const useNameResolver = (address: string) => {
  const provider = useProvider();
  const queryClient = useQueryClient();

  const { data: name, isLoading } = useQuery({
    queryKey: NS_QUERY_KEYS.name(address, provider?.url),
    queryFn: async () => {
      if (!provider) return null;
      const nameSystem = new NameSystemService(provider, queryClient);
      const { name } = await nameSystem.name(address);
      return name;
    },
    enabled: !!provider && isB256(address),
  });

  return { name, isLoading };
};
