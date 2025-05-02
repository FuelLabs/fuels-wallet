import { BakoIDClient } from '@bako-id/sdk';

export type NameSystemInput = {
  resolverDomain: {
    domain: string;
    chainId: number;
  };
  resolverAddreses: {
    addresses: string[];
    chainId: number;
  };
};

const client = new BakoIDClient();

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export default class NameSystemService {
  static async resolverDomain(params: NameSystemInput['resolverDomain']) {
    try {
      const address = await client.resolver(params.domain, params.chainId);
      return { address, error: null };
    } catch {
      return {
        address: null,
        error: 'Domain resolver is currently unavailable',
      };
    }
  }

  static async resolverAddresses(params: NameSystemInput['resolverAddreses']) {
    try {
      const domains = await client.names(params.addresses, params.chainId);

      return { domains, error: null };
    } catch {
      return { domains: null, error: 'Error on resolver address' };
    }
  }
}
