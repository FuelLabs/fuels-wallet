import type { BakoIDClient } from '@bako-id/sdk';

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

let client: Promise<BakoIDClient> | undefined;
function getClient() {
  client ??= import('@bako-id/sdk')
    .then((m) => new m.BakoIDClient())
    .catch((error) => {
      client = undefined;
      throw error;
    });
  return client;
}

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export default class NameSystemService {
  static async resolverDomain(params: NameSystemInput['resolverDomain']) {
    try {
      const address = await (await getClient()).resolver(
        params.domain,
        params.chainId
      );
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
      const domains = await (await getClient()).names(
        params.addresses,
        params.chainId
      );

      return { domains, error: null };
    } catch {
      return { domains: null, error: 'Error on resolver address' };
    }
  }
}
