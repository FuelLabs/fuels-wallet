import { BakoIDClient } from '@bako-id/sdk';
import type { QueryClient } from '@tanstack/react-query';
import type { Provider } from 'fuels';
import { NS_QUERY_KEYS } from '~/systems/NameSystem/utils/queryKeys';

type QueryData = string | null;

export class NameSystemService {
  private provider: Provider;
  private queryClient: QueryClient;
  private client: BakoIDClient;

  constructor(provider: Provider, queryClient: QueryClient) {
    this.provider = provider;
    this.client = new BakoIDClient(provider);
    this.queryClient = queryClient;
  }

  static profileURI(provider: Provider, name: string) {
    const client = new BakoIDClient(provider);
    return client.profile(name);
  }

  async name(address: string) {
    const queryKey = NS_QUERY_KEYS.address(address, this.provider.url);
    const queryData = this.queryClient.getQueryData<QueryData>(queryKey);

    if (typeof queryData !== 'undefined') {
      return { name: queryData, address };
    }

    let name = await this.client.name(address);
    name = name ? `@${name}` : null;
    this.queryClient.setQueryData(queryKey, name);
    return {
      name,
      address,
    };
  }

  async resolver(name: string) {
    const queryKey = NS_QUERY_KEYS.name(name, this.provider.url);
    const queryData = this.queryClient.getQueryData<QueryData>(queryKey);

    if (typeof queryData !== 'undefined') {
      return { name, address: queryData };
    }

    const resolver = await this.client.resolver(name);
    this.queryClient.setQueryData(queryKey, resolver);
    return {
      name,
      address: resolver,
    };
  }
}
