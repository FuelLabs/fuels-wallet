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
    const domain = await client.resolver(params.domain, params.chainId);
    return domain;
  }

  static async resolverAddress(params: NameSystemInput['name']) {
    const response = await client.name(params.address, params.chainId);
    return response ? `@${response}` : null;
  }
}
