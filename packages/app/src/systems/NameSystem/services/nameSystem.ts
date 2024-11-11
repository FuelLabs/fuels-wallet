import { OffChainSync } from '@bako-id/sdk';
import { Address, type Provider } from 'fuels';

type ChainId = number;

export class NameSystemService {
  private constructor(private offChainSync: OffChainSync) {}

  private static instances: { [key: ChainId]: OffChainSync } = {};

  static async connect(provider: Provider) {
    const chainId = provider.getChainId();
    let instance = NameSystemService.instances[chainId];

    if (!instance) {
      instance = await OffChainSync.create(provider);
      NameSystemService.instances[chainId] = instance;
    }

    return new NameSystemService(instance);
  }

  name(address: string) {
    const addressInstance = Address.fromString(address);
    let name = this.offChainSync.getDomain(addressInstance.toB256());

    if (!name) {
      name = this.offChainSync.getDomain(addressInstance.toString());
    }

    return name ? `@${name}` : undefined;
  }

  resolver(name: string) {
    return this.offChainSync.getResolver(name);
  }
}
