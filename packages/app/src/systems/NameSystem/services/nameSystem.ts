import { BakoIDClient } from '@bako-id/sdk';

export type NameSystemInput = {
  resolver: {
    domain: string;
    chainId: number;
  };
  name: {
    address: string;
    chainId: number;
  };
};

const client = new BakoIDClient();

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export default class NameSystemService {
  static async resolverDomain(params: NameSystemInput['resolver']) {
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

  static async resolverAddress(params: NameSystemInput['name']) {
    try {
      const response = await client.name(params.address, params.chainId);
      const domain = response ? `@${response}` : null;

      return { domain, error: null };
    } catch {
      return { domain: null, error: 'Error on resolver address' };
    }
  }
}
