import type { AbstractAddress } from 'fuels';

import { FuelWeb3Provider } from './FuelWeb3Provider';
import { FuelWeb3SDK } from './FuelWeb3SDK';
import { FuelWeb3Wallet } from './FuelWeb3Wallet';

// Isolate the provider instance to prevent
// developers from replacing the provider
// instance with a new one
const FuelWeb3Privates: {
  provider?: FuelWeb3Provider;
} = {};

export class FuelWeb3 extends FuelWeb3SDK {
  static FuelWeb3Provider = FuelWeb3Provider;
  static FuelWeb3Wallet = FuelWeb3Wallet;

  private async getCurrentProvider(): Promise<FuelWeb3Provider> {
    // Return the current provider instance if it exists
    if (FuelWeb3Privates.provider) {
      return FuelWeb3Privates.provider;
    }
    // Otherwise, create a new provider instance
    // fetch the current network and connect the provider
    const provider = await this.getProvider();
    FuelWeb3Privates.provider = provider;

    // Listen for network changes and connect the provider
    // selected network from the user
    this.on('network', async (network) => {
      FuelWeb3Privates.provider?.connect(network.url);
    });

    return FuelWeb3Privates.provider;
  }

  async getProvider(): Promise<FuelWeb3Provider> {
    const network = await this.network();
    return new FuelWeb3Provider(network.url, this);
  }

  async getWallet(address: string | AbstractAddress): Promise<FuelWeb3Wallet> {
    const provider = await this.getCurrentProvider();
    return new FuelWeb3Wallet(address, provider);
  }
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    FuelWeb3: FuelWeb3 | undefined;
  }
}
